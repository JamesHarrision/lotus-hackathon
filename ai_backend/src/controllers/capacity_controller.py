from fastapi import APIRouter, HTTPException
from models.schemas import RoutingRequest, RoutingResponse, Branch, BranchOption
from services import routing_service

router = APIRouter()

# Mock Database / State (In reality, fetch this from your DB via a repository)
MOCK_BRANCH_DB = [
    Branch(branch_id="highlands_d1", company_id="highlands", current_capacity=95, max_capacity=100, arrival_rate_lambda=4.0, departure_rate_mu=2.0, avg_serving_time_minutes=2.0),
    Branch(branch_id="highlands_d3", company_id="highlands", current_capacity=20, max_capacity=80, arrival_rate_lambda=1.0, departure_rate_mu=1.5, avg_serving_time_minutes=2.0),
    Branch(branch_id="thecoffeehouse_d1", company_id="tch", current_capacity=50, max_capacity=100, arrival_rate_lambda=2.0, departure_rate_mu=2.0, avg_serving_time_minutes=3.0)
]

@router.post("/calculate-routes", response_model=RoutingResponse)
def calculate_routes(request: RoutingRequest):
    # 1. Filter branches by the requested company_id
    company_branches = [b for b in MOCK_BRANCH_DB if b.company_id == request.company_id]
    
    if not company_branches:
        raise HTTPException(status_code=404, detail="No branches found for this company.")

    # 2. Build the options mapping (Mocking distances and incentives for the example)
    branch_options = []
    current_branch = None
    
    
    for branch in company_branches:
        if branch.branch_id == request.current_branch_id:
            current_branch = branch
            branch_options.append(BranchOption(branch=branch, distance_to_user_km=0.5, incentive_offered=0.0))
        else:
            # For alternatives, offer an incentive to move
            branch_options.append(BranchOption(branch=branch, distance_to_user_km=2.5, incentive_offered=15.0))

    if not current_branch:
        raise HTTPException(status_code=404, detail="Current branch not found.")

    # 3. Execute the Math Core (Softmax Probabilities)
    probabilities = routing_service.calculate_multinomial_logit_probabilities(
        user_prefs=request.user_prefs,
        branch_options=branch_options
    )
    
    # 4. Calculate how many users need notifications based on the best alternative's probability
    # (Assuming the highest probability alternative is the one we push)
    alt_probs = [p for b_id, p in probabilities.items() if b_id != request.current_branch_id]
    best_alt_prob = max(alt_probs) if alt_probs else 0.01
    
    pings_needed = routing_service.calculate_notifications_needed(
        branch=current_branch,
        threshold_percent=0.85, # Target 85% capacity
        average_switch_prob=best_alt_prob
    )

    # 5. Return the payload to the frontend
    return RoutingResponse(
        user_id=request.user_prefs.user_id,
        recommendations=probabilities,
        notifications_to_send=pings_needed
    )