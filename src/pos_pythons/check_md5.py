import sys
import json
from bakong_khqr import KHQR

token = sys.argv[1]
md5_signature = sys.argv[2]

khqr = KHQR(token)
result = khqr.check_payment(md5=md5_signature)

print(json.dumps(result))


# khqr = KHQR("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiZGI0ZGYyMDViODI2NDllNyJ9LCJpYXQiOjE3NjI0ODk3MTgsImV4cCI6MTc3MDI2NTcxOH0.7VbQ84jwprt6OI8lYc7Te_tEn913E5RAI6E6bpkECo0")
# result = khqr.check_payment("0cca037734e72c6bbd5babf6e53f6ea6")