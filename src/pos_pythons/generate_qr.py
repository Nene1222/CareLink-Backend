# import sys
# import json
# from bakong_khqr import KHQR, IndividualInfo

# token = sys.argv[1]

# khqr = KHQR(token)

# qr = khqr.create_qr(
#     bank_account="john@asc",
#     merchant_name="John",
#     merchant_city="Phnom Penh",
#     amount="10",
#     currency="USD",
#     store_label="POS Test",
#     phone_number="012345678",
#     bill_number="TRX123",
#     terminal_label="POS-01"
# )

# # Print JSON to stdout
# print(json.dumps(qr))


# pythons/generate_qr.py
import json
from bakong_khqr import KHQR

def generate_qr(token, amount):
    khqr = KHQR(token)

    qr = khqr.create_qr(
        bank_account="panharong_sin@wing",
        merchant_name="Panharong Sin",
        merchant_city="Phnom Penh",
        amount=str(amount),
        currency="USD",
        store_label="POS Test",
        phone_number="012345678",
        bill_number="TRX123",
        terminal_label="POS-01"
    )
   
    # Generate MD5 for the QR code
    md5_item = khqr.generate_md5(qr)

    # Return both as a dictionary
    return {
        "qr": qr,
        "md5": md5_item
    }

# Optional: allow running from command line too
if __name__ == "__main__":
    import sys
    token = sys.argv[1]
    amount = sys.argv[2]
    qr = generate_qr(token, amount)
    print(json.dumps(qr))

