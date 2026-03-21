class LocationNode:
    def __init__(self, node_id: int, name: str, max_capacity: int):
        self.id = node_id
        self.name = name
        self.max_capacity = max_capacity
        self.current_capacity = 0

    def available_space(self) -> int:
        return self.max_capacity - self.current_capacity

class OverflowDispatcher:
    def __init__(self, num_nodes: int):
        # Initialize lists with the correct size
        self.nodes = [None] * num_nodes
        self.fallback_routes = [[] for _ in range(num_nodes)]

    def set_node(self, node_id: int, name: str, max_cap: int):
        self.nodes[node_id] = LocationNode(node_id, name, max_cap)

    def set_fallback_routes(self, source_node_id: int, sorted_neighbors: list):
        self.fallback_routes[source_node_id] = sorted_neighbors

    def update_capacity(self, node_id: int, current_people: int):
        self.nodes[node_id].current_capacity = current_people

    def dispatch_overflow(self, overflow_node_id: int, people_queue: list):
        print(f"\n--- OVERFLOW DETECTED AT {self.nodes[overflow_node_id].name.upper()} ---")
        
        targets = self.fallback_routes[overflow_node_id]

        for i, person in enumerate(people_queue):
            routed = False

            # Find the nearest node that still has capacity
            for target_id in targets:
                if self.nodes[target_id].available_space() > 0:
                    # Assign the person
                    print(f"Priority {i + 1} ({person}) -> Redirected to {self.nodes[target_id].name}")
                    
                    # Update the target's capacity immediately so the next person sees it
                    self.nodes[target_id].current_capacity += 1
                    routed = True
                    break 

            if not routed:
                # [Inference] This is expected behavior if the entire network is completely saturated, not guaranteed to happen in normal operation.
                print(f"Priority {i + 1} ({person}) -> NO CAPACITY AVAILABLE IN NETWORK!")


if __name__ == "__main__":
    # 1. Initialize System with 3 nodes (0: Saigon, 1: Bao Loc, 2: Da Lat)
    system = OverflowDispatcher(3)
    system.set_node(0, "Saigon", 500)
    system.set_node(1, "Bao Loc Hub", 2)  # Artificially low capacity to force overflow
    system.set_node(2, "Da Lat", 300)

    # 2. Pre-compute distances (Do this once). 
    # If Bao Loc (1) overflows, the nearest is Da Lat (2), then Saigon (0).
    system.set_fallback_routes(1, [2, 0])

    # 3. Simulated YOLO Loop
    # YOLO detects Bao Loc has reached its 2-person limit.
    system.update_capacity(1, 2)
    
    # YOLO detects Da Lat has 299 people (only 1 spot left!)
    system.update_capacity(2, 299)

    # YOLO detects 3 new people arriving at Bao Loc, creating an overflow queue.
    # The model sorted them by arrival time.
    overflow_queue = ["Person A (1st)", "Person B (2nd)", "Person C (3rd)"]

    # 4. Dispatch
    system.dispatch_overflow(1, overflow_queue)