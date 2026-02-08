"""
Geometry utility functions for bone fracture analysis
"""
import math
import numpy as np
import open3d as o3d


def angle_from_negative_x(p1, p2, center=(0, 0)):
    """
    Calculate angle from negative X-axis between two points
    
    Args:
        p1: First point (x, y)
        p2: Second point (x, y)
        center: Center point for calculation (default: origin)
        
    Returns:
        Angle in degrees
    """
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


def get_relative_position(head, tail, fracture):
    """
    Calculate relative position of fracture point between head and tail
    
    Args:
        head: Head point (x, y)
        tail: Tail point (x, y)
        fracture: Fracture point (x, y)
        
    Returns:
        Relative position as ratio (0.0 to 1.0)
    """
    y1, y2, y3 = head[1], tail[1], fracture[1]
    
    if y1 < y2:
        y1, y2 = y2, y1
    
    h = y1 - y2
    
    return 1 - (y1 - y3) / h if h else 0


def create_angle_mesh(mesh, angles, split_ratio):
    """
    Apply angular deformation to mesh at specified split ratio
    
    Args:
        mesh: Open3D TriangleMesh object
        angles: Tuple of (top_angle, bottom_angle) in degrees
        split_ratio: Position to split mesh (0.0 to 1.0)
        
    Returns:
        Deformed Open3D TriangleMesh object
    """
    vertices = np.asarray(mesh.vertices)
    triangles = np.asarray(mesh.triangles)
    
    min_y = vertices[:, 1].min()
    max_y = vertices[:, 1].max()
    
    mid_y = min_y + (max_y - min_y) * split_ratio
    
    top_mask = vertices[:, 1] >= mid_y
    bottom_mask = ~top_mask
    
    
    def rotate_part(mask, angle_deg, center_y):
        """Rotate portion of mesh"""
        indices = np.where(mask)[0]
        
        sub_vertices = np.copy(vertices[indices])
        
        index_map = -np.ones(len(vertices), dtype=int)
        index_map[indices] = np.arange(len(indices))
        
        tri_mask = np.all(mask[triangles], axis=1)
        sub_triangles = triangles[tri_mask]
        mapped = index_map[sub_triangles]
        
        # Create rotation matrix
        R = mesh.get_rotation_matrix_from_axis_angle(
            [0, 0, np.radians(angle_deg)]
        )
        
        # Calculate center for rotation
        center = [
            sub_vertices[:, 0].mean(),
            center_y,
            sub_vertices[:, 2].mean()
        ]
        
        # Apply rotation
        rotated = (R @ (sub_vertices - center).T).T + center
        
        # Create sub-mesh
        sub = o3d.geometry.TriangleMesh()
        sub.vertices = o3d.utility.Vector3dVector(rotated)
        sub.triangles = o3d.utility.Vector3iVector(mapped)
        sub.compute_vertex_normals()
        
        return sub
    
    
    top = rotate_part(top_mask, angles[0], mid_y)
    bottom = rotate_part(bottom_mask, angles[1], mid_y)
    
    return top + bottom
