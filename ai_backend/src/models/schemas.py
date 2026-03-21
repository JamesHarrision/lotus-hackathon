from pydantic import BaseModel
from typing import List, Dict

class Branch(BaseModel):
    branch_id: str
    company_id: str
    current_capacity: int
    max_capacity: int
    arrival_rate_lambda: float     # People arriving per minute
    departure_rate_mu: float       # People leaving per minute
    avg_serving_time_minutes: float # Minutes to serve one person

class UserPreferences(BaseModel):
    user_id: str
    beta_dist: float  # e.g., -1.5 (Penalty per km)
    beta_wait: float  # e.g., -1.0 (Penalty per expected wait minute)
    beta_inc: float   # e.g.,  0.5 (Boost per discount point)

class BranchOption(BaseModel):
    branch: Branch
    distance_to_user_km: float
    travel_time_minutes: float
    incentive_offered: float

class CameraStream(BaseModel):
    camera_id: str
    source_path: str
    branch_id: int

class TrafficReport(BaseModel):
    total: int
    breakdown: Dict[str, int]

class RoutingRequest(BaseModel):
    company_id: str
    user_prefs: UserPreferences 
    current_branch_id: str

class RoutingResponse(BaseModel):
    user_id: str
    recommendations: Dict[str, float] # {branch_id: probability}
    notifications_to_send: int
    recommended_branch_id: str
    estimated_wait_time: float # Minutes
    cost: float