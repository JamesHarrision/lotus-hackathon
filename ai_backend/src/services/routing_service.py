import math
from typing import Dict, List
from models.schemas import Branch, UserPreferences, BranchOption

def calculate_dynamic_expected_wait_time(
    branch: Branch, 
    distance_km: float, 
    travel_time_minutes
) -> float:
    """Projects queue size upon arrival and calculates expected wait."""
    net_flow_per_minute = branch.arrival_rate_lambda - branch.departure_rate_mu
    
    projected_queue_change = net_flow_per_minute * travel_time_minutes
    queue_at_arrival = max(0, branch.current_capacity + projected_queue_change)
    
    return queue_at_arrival * branch.avg_serving_time_minutes

def calculate_multinomial_logit_probabilities(
    user_prefs: UserPreferences, 
    branch_options: List[BranchOption]
) -> Dict[str, Dict[str, float]]:
    """Calculates Softmax probability distribution and metrics across branches."""
    utilities = {}
    metrics = {}
    
    for option in branch_options:
        travel_time_minutes = option.travel_time_minutes
        
        wait_time = calculate_dynamic_expected_wait_time(
            branch=option.branch, 
            distance_km=option.distance_to_user_km,
            travel_time_minutes=travel_time_minutes
        )
        
        # Utility formula: U = beta_dist*Dist + beta_wait*Wait + beta_inc*Incentive
        u = (user_prefs.beta_dist * option.distance_to_user_km) + \
            (user_prefs.beta_wait * wait_time) + \
            (user_prefs.beta_inc * option.incentive_offered)
            
        utilities[option.branch.branch_id] = u
        metrics[option.branch.branch_id] = {
            "utility": u,
            "wait_time": wait_time,
            "travel_time": travel_time_minutes
        }

    # Softmax with numerical stability
    max_u = max(utilities.values()) if utilities else 0
    exp_utilities = {b_id: math.exp(u - max_u) for b_id, u in utilities.items()}
    sum_exp = sum(exp_utilities.values())
    
    results = {}
    for b_id in utilities.keys():
        prob = (exp_utilities[b_id] / sum_exp) if sum_exp > 0 else 0.0
        results[b_id] = {
            "probability": prob,
            "wait_time": metrics[b_id]["wait_time"],
            "utility": metrics[b_id]["utility"]
        }
        
    return results

def calculate_notifications_needed(
    branch: Branch, 
    threshold_percent: float, 
    average_switch_prob: float
) -> int:
    """Determines how many people to ping to safely balance load."""
    critical_threshold = int(branch.max_capacity * threshold_percent)
    
    if branch.current_capacity <= critical_threshold:
        return 0
        
    excess_users = branch.current_capacity - critical_threshold
    
    if average_switch_prob <= 0.01:
        return 999 # Handle zero-probability edge case
        
    return math.ceil(excess_users / average_switch_prob)