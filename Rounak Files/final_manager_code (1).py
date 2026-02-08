import os
import json
import math
import cv2
import numpy as np
import open3d as o3d
import tkinter as tk
from tkinter import filedialog
from ultralytics import YOLO

from datetime import datetime


# =========================================================
# 📂 FILE PICKER
# =========================================================

def pick_file(title, filetypes):

    root = tk.Tk()

    root.lift()
    root.attributes('-topmost', True)
    root.withdraw()

    path = filedialog.askopenfilename(
        parent=root,
        title=title,
        filetypes=filetypes
    )

    root.destroy()

    return path


# =========================================================
# 🖱️ MANUAL LANDMARK SELECTOR
# =========================================================

def select_landmarks_manual(image, labels):

    clone = image.copy()
    points = {}
    idx = [0]


    def mouse(event, x, y, flags, param):

        if event == cv2.EVENT_LBUTTONDOWN:

            if idx[0] >= len(labels):
                return

            label = labels[idx[0]]

            points[label] = (x, y)

            cv2.circle(clone, (x, y), 6, (0, 0, 255), -1)

            cv2.putText(
                clone,
                label,
                (x + 5, y - 5),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.5,
                (0, 255, 255),
                1
            )

            print(f"{label}: ({x}, {y})")

            idx[0] += 1

            cv2.imshow("Select Landmarks", clone)

            if idx[0] == len(labels):
                cv2.destroyAllWindows()


    cv2.namedWindow("Select Landmarks", cv2.WINDOW_NORMAL)

    cv2.setMouseCallback("Select Landmarks", mouse)

    print("\nCLICK IN THIS ORDER:")

    for i, l in enumerate(labels):
        print(f"{i+1}. {l}")

    cv2.imshow("Select Landmarks", clone)

    cv2.waitKey(0)

    return points


# =========================================================
# 📐 GEOMETRY HELPERS
# =========================================================

def get_relative_position(head, tail, fracture):

    y1, y2, y3 = head[1], tail[1], fracture[1]

    if y1 < y2:
        y1, y2 = y2, y1

    h = y1 - y2

    return 1 - (y1 - y3) / h if h else 0


def angle_from_negative_x(p1, p2, center=(0, 0)):

    x1, y1 = p1[0] - center[0], p1[1] - center[1]
    x2, y2 = p2[0] - center[0], p2[1] - center[1]

    dx, dy = x2 - x1, y2 - y1

    angle = math.degrees(math.atan2(dy, dx)) % 360

    angle = (angle - 180) % 360

    if angle <= 90:
        return -(90 - angle)
    elif angle <= 180:
        return angle - 90
    elif angle <= 270:
        return 270 - angle

    return 360 - angle


# =========================================================
# ✅ MESH DEFORMATION
# =========================================================

def create_angle_mesh(mesh, angles, split_ratio):

    vertices = np.asarray(mesh.vertices)
    triangles = np.asarray(mesh.triangles)

    min_y = vertices[:, 1].min()
    max_y = vertices[:, 1].max()

    mid_y = min_y + (max_y - min_y) * split_ratio

    top_mask = vertices[:, 1] >= mid_y
    bottom_mask = ~top_mask


    def rotate_part(mask, angle_deg, center_y):

        indices = np.where(mask)[0]

        sub_vertices = np.copy(vertices[indices])

        index_map = -np.ones(len(vertices), dtype=int)
        index_map[indices] = np.arange(len(indices))

        tri_mask = np.all(mask[triangles], axis=1)

        sub_triangles = triangles[tri_mask]

        mapped = index_map[sub_triangles]


        R = mesh.get_rotation_matrix_from_axis_angle(
            [0, 0, np.radians(angle_deg)]
        )


        center = [
            sub_vertices[:, 0].mean(),
            center_y,
            sub_vertices[:, 2].mean()
        ]


        rotated = (R @ (sub_vertices - center).T).T + center


        sub = o3d.geometry.TriangleMesh()

        sub.vertices = o3d.utility.Vector3dVector(rotated)

        sub.triangles = o3d.utility.Vector3iVector(mapped)

        sub.compute_vertex_normals()

        return sub


    top = rotate_part(top_mask, angles[0], mid_y)

    bottom = rotate_part(bottom_mask, angles[1], mid_y)

    return top + bottom


# =========================================================
# 🚀 MAIN
# =========================================================

def main():

    os.makedirs("Output", exist_ok=True)


    # ----------------------------
    # FILE SELECTION
    # ----------------------------

    print("Select X-ray")

    image_path = pick_file(
        "Select X-ray",
        [("Images", "*.jpg *.png *.jpeg")]
    )

    if not image_path:
        return


    print("Select 3D Model")

    mesh_path = pick_file(
        "Select 3D Model",
        [("3D Models", "*.glb *.obj *.ply")]
    )

    if not mesh_path:
        return


    print("Select YOLO Model")

    yolo_path = pick_file(
        "Select YOLO Model",
        [("YOLO", "*.pt")]
    )

    if not yolo_path:
        return


    # ----------------------------
    # LOAD IMAGE
    # ----------------------------

    img = cv2.imread(image_path)

    if img is None:
        raise RuntimeError("Image load failed")

    h, w = img.shape[:2]

    cx, cy = w // 2, h // 2


    # ----------------------------
    # YOLO
    # ----------------------------

    model = YOLO(yolo_path)

    res = model(img)[0]

    breaks = {}

    for b in res.boxes:

        x1, y1, x2, y2 = b.xyxy[0].tolist()

        xc, yc = (x1 + x2) / 2, (y1 + y2) / 2

        if xc < cx:
            breaks["radius_break"] = (int(xc - cx), int(cy - yc))
        else:
            breaks["ulna_break"] = (int(xc - cx), int(cy - yc))


    print("Detected:", breaks)


    # ----------------------------
    # MANUAL LANDMARKS
    # ----------------------------

    labels = [
        "ulna_head",
        "ulna_tail",
        "radius_head",
        "radius_tail"
    ]

    print("\nClick landmarks")

    raw_points = select_landmarks_manual(img, labels)


    landmarks = {}

    for name, (x, y) in raw_points.items():

        landmarks[name] = (
            int(x - cx),
            int(cy - y)
        )

    # ----------------------------
    # LOAD MESH
    # ----------------------------

    mesh = o3d.io.read_triangle_mesh(mesh_path)
    mesh.compute_vertex_normals()

    # ----------------------------
    # ANALYSIS
    # ----------------------------

    fracture_positions = {}

    for bone in ["ulna", "radius"]:

        k = f"{bone}_break"

        if k in breaks:

            r = get_relative_position(
                landmarks[f"{bone}_head"],
                landmarks[f"{bone}_tail"],
                breaks[k]
            )

            a1 = angle_from_negative_x(
                landmarks[f"{bone}_head"],
                breaks[k]
            )

            a2 = angle_from_negative_x(
                breaks[k],
                landmarks[f"{bone}_tail"]
            )
            fracture_positions[bone] = r
            mesh = create_angle_mesh(mesh, [a1, a2], r)

    # ----------------------------
    # OUTPUT MODEL
    # ----------------------------

    output_model_path = "Output/output_model.glb"

    o3d.io.write_triangle_mesh(output_model_path, mesh)

    o3d.visualization.draw_geometries([mesh])

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    json_path = f"Output/result_{timestamp}.json"
    result_data = {

        "timestamp": timestamp,

        "input_files": {
            "xray_image": image_path,
            "mesh_model": mesh_path,
            "yolo_model": yolo_path
        },

        "detected_breaks": breaks,
        "landmarks": landmarks,
        "fracture_positions": fracture_positions,
        "output_model": output_model_path
    }

    with open(json_path, "w") as f:
        json.dump(result_data, f, indent=4)

    print("\n📄 New JSON saved:", json_path)

# =========================================================
if __name__ == "__main__":
    main()