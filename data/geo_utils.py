import math

def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    R = 6371  # Earth radius in kilometers
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = (math.sin(dlat/2)**2 + 
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

def point_in_polygon(lat: float, lng: float, polygon_bounds: list) -> bool:
    """
    Ray-casting algorithm to determine if a point is inside a polygon.
    polygon_bounds: List of [lat, lng] pairs forming the polygon.
    """
    x, y = lng, lat
    n = len(polygon_bounds)
    inside = False
    
    if n < 3:
        return False
        
    p1y, p1x = polygon_bounds[0]
    for i in range(1, n + 1):
        p2y, p2x = polygon_bounds[i % n]
        
        if min(p1y, p2y) < y <= max(p1y, p2y):
            if x <= max(p1x, p2x):
                if p1y != p2y:
                    xints = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                    if p1x == p2x or x <= xints:
                        inside = not inside
        p1y, p1x = p2y, p2x

    return inside
