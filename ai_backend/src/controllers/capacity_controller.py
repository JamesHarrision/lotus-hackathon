from fastapi import APIRouter, HTTPException
from typing import Dict
from models.schemas import RoutingRequest, RoutingResponse, Branch, BranchOption, UserPreferences
from services import routing_service

router = APIRouter()

# Mock Database / State (In reality, fetch this from your DB via a repository)
MOCK_BRANCH_DB = [
    Branch(branch_id="highlands_d1", company_id="highlands", current_capacity=95, max_capacity=100, arrival_rate_lambda=4.0, departure_rate_mu=2.0, avg_serving_time_minutes=2.0),
    Branch(branch_id="highlands_d3", company_id="highlands", current_capacity=20, max_capacity=80, arrival_rate_lambda=1.0, departure_rate_mu=1.5, avg_serving_time_minutes=2.0),
    Branch(branch_id="thecoffeehouse_d1", company_id="tch", current_capacity=50, max_capacity=100, arrival_rate_lambda=2.0, departure_rate_mu=2.0, avg_serving_time_minutes=3.0)
]

@router.post("/calculate-routes", response_model=RoutingResponse)
def calculate_routes(request: Dict):
    # 1. Parse incoming data from Node.js
    company_id = request.get("company_id")
    user_prefs_data = request.get("user_prefs")
    current_branch_id = request.get("current_branch_id")
    branches_data = request.get("branches_data", [])
    user_to_branches_data = request.get("user_to_branches", [])

    if not branches_data:
        raise HTTPException(status_code=404, detail="No branches data provided.")

    # 2. Build objects for the algorithm
    branches = [Branch(**b) for b in branches_data]
    user_prefs = UserPreferences(**user_prefs_data)
    
    # Map distance and travel time from user_to_branches_data
    matrix_map = {m["branch_id"]: m for m in user_to_branches_data}
    
    branch_options = []
    current_branch = None
    
    for branch in branches:
        matrix = matrix_map.get(branch.branch_id, {"distance_km": 5.0, "travel_time_minutes": 15.0})
        
        # Incentive logic: Offer incentive if it's NOT the current branch and it has lower load
        incentive = 0.0
        if branch.branch_id != current_branch_id:
            incentive = 20.0 # Standard incentive for rerouting
            
        option = BranchOption(
            branch=branch,
            distance_to_user_km=matrix["distance_km"],
            travel_time_minutes=matrix["travel_time_minutes"],
            incentive_offered=incentive
        )
        branch_options.append(option)
        
        if branch.branch_id == current_branch_id:
            current_branch = branch

    # 3. Execute the Math Core
    results = routing_service.calculate_multinomial_logit_probabilities(
        user_prefs=user_prefs,
        branch_options=branch_options
    )
    
    # 4. Find the best recommended branch
    best_branch_id = max(results, key=lambda x: results[x]["probability"])
    best_result = results[best_branch_id]
    
    prob_map = {b_id: info["probability"] for b_id, info in results.items()}
    
    # 5. Calculate notifications needed for the current branch
    best_alt_prob = max([info["probability"] for b_id, info in results.items() if b_id != current_branch_id], default=0.1)
    
    pings_needed = 0
    if current_branch:
        pings_needed = routing_service.calculate_notifications_needed(
            branch=current_branch,
            threshold_percent=0.8,
            average_switch_prob=best_alt_prob
        )

    # 6. Return response
    return RoutingResponse(
        user_id=user_prefs.user_id,
        recommendations=prob_map,
        notifications_to_send=pings_needed,
        recommended_branch_id=best_branch_id,
        estimated_wait_time=best_result["wait_time"],
        cost=best_result["utility"]
    )