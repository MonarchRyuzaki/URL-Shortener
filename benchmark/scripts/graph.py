import matplotlib.pyplot as plt

# 1) Define the connection‐counts you tested
connections = [1, 5, 10, 25, 50, 100]

# 2) LOCAL environment data (solid lines)
reqsec_local_p1 = [20.37, 99.49, 104.35, 118.32, 123.26, 126.12]  # Point 1 (No Cache)
reqsec_local_p2 = [17.78, 89.09, 166.44, 231.62, 294.95, 385.31]  # Point 2 
reqsec_local_p3 = [15.17, 74.31, 145.84, 232.38, 284.6, 390.06]   # Point 3
reqsec_local_p4 = [13.57, 66.49, 133.48, 234.03, 296.54, 400.49]   # Point 4
reqsec_local_p5 = [13.69, 70.84, 142.17, 229.31, 305.87, 423.86]  # Point 5

# 3) RENDER environment data (dashed lines) - from the table
reqsec_render_p1 = [4.49, 23.26, 47.43, 75.55, 87.45, 86.03]     # Point 1
reqsec_render_p2 = [4.59, 23.35, 47.68, 110.91, 154.22, 187.93]  # Point 2
reqsec_render_p3 = [4.6, 24.74, 47.62, 110.81, 131.12, 151.49]   # Point 3
reqsec_render_p4 = [4.3, 21.88, 42.58, 91.5, 118.11, 138.11]     # Point 4


# Create requests per second graph
plt.figure(figsize=(12, 8))

# Local environment (solid lines)
plt.plot(connections, reqsec_local_p1, marker='o', linestyle='-', label='Point 1 (Local)', linewidth=2, color='C0')
plt.plot(connections, reqsec_local_p2, marker='s', linestyle='-', label='Point 2 (Local)', linewidth=2, color='C1')
plt.plot(connections, reqsec_local_p3, marker='^', linestyle='-', label='Point 3 (Local)', linewidth=2, color='C2')
plt.plot(connections, reqsec_local_p4, marker='d', linestyle='-', label='Point 4 (Local)', linewidth=2, color='C3')
plt.plot(connections, reqsec_local_p5, marker='v', linestyle='-', label='Point 5 (Local)', linewidth=2, color='C4')

# Render environment (dashed lines, same colors)
plt.plot(connections, reqsec_render_p1, marker='o', linestyle='--', label='Point 1 (Render)', linewidth=2, color='C0')
plt.plot(connections, reqsec_render_p2, marker='s', linestyle='--', label='Point 2 (Render)', linewidth=2, color='C1')
plt.plot(connections, reqsec_render_p3, marker='^', linestyle='--', label='Point 3 (Render)', linewidth=2, color='C2')
plt.plot(connections, reqsec_render_p4, marker='d', linestyle='--', label='Point 4 (Render)', linewidth=2, color='C3')

plt.xlabel('Concurrent Connections')
plt.ylabel('Average Req/Sec')
plt.title('Performance Comparison: Requests per Second (Local vs Render)')
plt.xticks(connections)
plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

# 4) LOCAL environment latency data
latency_local_p1 = [45.95, 52.55, 155.02, 293.58, 422.81, 741.83]  # Point 1 (No Cache)
latency_local_p2 = [57.39, 57.25, 62.41, 167.95, 247.65, 331.87]  # Point 2 
latency_local_p3 = [65.67, 67.35, 70.25, 159.74, 250.5, 333.75]   # Point 3
latency_local_p4 = [74.61, 76.37, 77.34, 138.62, 236.1, 310.61]   # Point 4
latency_local_p5 = [75.17, 86.45, 70.04, 148.22, 243.65, 309.02]  # Point 5

# 5) RENDER environment latency data - from the table
latency_render_p1 = [213.09, 211.27, 207.39, 326.39, 548.46, 1090]     # Point 1
latency_render_p2 = [212.25, 210.77, 205.6, 220.36, 319.69, 518.89]    # Point 2
latency_render_p3 = [212.99, 199.09, 204.66, 215.68, 369.46, 622.35]   # Point 3
latency_render_p4 = [223.58, 220.65, 231.54, 271.03, 406.38, 701.45]   # Point 4

# Create latency graph
plt.figure(figsize=(12, 8))

# Local environment (solid lines)
plt.plot(connections, latency_local_p1, marker='o', linestyle='-', label='Point 1 (Local)', linewidth=2, color='C0')
plt.plot(connections, latency_local_p2, marker='s', linestyle='-', label='Point 2 (Local)', linewidth=2, color='C1')
plt.plot(connections, latency_local_p3, marker='^', linestyle='-', label='Point 3 (Local)', linewidth=2, color='C2')
plt.plot(connections, latency_local_p4, marker='d', linestyle='-', label='Point 4 (Local)', linewidth=2, color='C3')
plt.plot(connections, latency_local_p5, marker='v', linestyle='-', label='Point 5 (Local)', linewidth=2, color='C4')

# Render environment (dashed lines, same colors)
plt.plot(connections, latency_render_p1, marker='o', linestyle='--', label='Point 1 (Render)', linewidth=2, color='C0')
plt.plot(connections, latency_render_p2, marker='s', linestyle='--', label='Point 2 (Render)', linewidth=2, color='C1')
plt.plot(connections, latency_render_p3, marker='^', linestyle='--', label='Point 3 (Render)', linewidth=2, color='C2')
plt.plot(connections, latency_render_p4, marker='d', linestyle='--', label='Point 4 (Render)', linewidth=2, color='C3')

plt.xlabel('Concurrent Connections')
plt.ylabel('Average Latency (ms)')
plt.title('Performance Comparison: Average Latency (Local vs Render)')
plt.xticks(connections)
plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

# NEW: Load Balancer + Horizontal Scaling Comparison (Extended Range)
# Point 4: Without Load Balancer, Point 5: With Load Balancer + Horizontal Scaling
# Extended connection counts for load balancer comparison
connections_extended = [1, 5, 10, 25, 50, 100, 300, 400, 500]

# Extended data for Point 4 (without load balancer) and Point 5 (with load balancer + scaling)
reqsec_extended_p4 = [13.57, 66.49, 133.48, 234.03, 296.54, 400.49, 420.7, 545.63, 566.21]  # Point 4 extended
reqsec_extended_p5 = [13.69, 70.84, 142.17, 229.31, 305.87, 423.86, 536.45, 702.73, 2500.06]  # Point 5 extended

latency_extended_p4 = [74.61, 76.37, 77.34, 138.62, 236.1, 310.61, 247.49, 200.26, 117.56]   # Point 4 extended latency
latency_extended_p5 = [75.17, 86.45, 70.04, 148.22, 243.65, 309.02, 391.49, 301.21, 218.85]  # Point 5 extended latency

# Requests per second comparison
plt.figure(figsize=(12, 8))
plt.plot(connections_extended, reqsec_extended_p4, marker='d', linestyle='-', label='Point 4 (Without LB)', linewidth=2, color='C3', markersize=8)
plt.plot(connections_extended, reqsec_extended_p5, marker='v', linestyle='-', label='Point 5 (With LB + Scaling)', linewidth=2, color='C4', markersize=8)

plt.xlabel('Concurrent Connections')
plt.ylabel('Average Req/Sec')
plt.title('Load Balancer + Horizontal Scaling Impact: Requests per Second')
plt.xticks(connections_extended)
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

# Latency comparison  
plt.figure(figsize=(12, 8))
plt.plot(connections_extended, latency_extended_p4, marker='d', linestyle='-', label='Point 4 (Without LB)', linewidth=2, color='C3', markersize=8)
plt.plot(connections_extended, latency_extended_p5, marker='v', linestyle='-', label='Point 5 (With LB + Scaling)', linewidth=2, color='C4', markersize=8)

plt.xlabel('Concurrent Connections')
plt.ylabel('Average Latency (ms)')
plt.title('Load Balancer + Horizontal Scaling Impact: Average Latency')
plt.xticks(connections_extended)
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()

