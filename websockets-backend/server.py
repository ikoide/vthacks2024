from sanic import Sanic
from sanic.response import json as sanic_json
from sanic import response
import json
import requests

app = Sanic("Websockets-Backend")

on_going_trades = {}
connected_clients = {}  # Maps trade_id to list of websocket connections

@app.route("/receive_trade_init", methods=["POST"])
async def receive_trade_init(request):
    print(request.json)
    # Extract users from request
    users = [user["email"] for user in request.json.get("users", [])]
    
    # Create trades dictionary
    trades = {}
    for user in users:
        index = users.index(user)
        trades[user] = {
            "drop": request.json.get("items", [])[index],
            "add": request.json.get("items", [])[index - 1],
            "cookies": {},
            "ready": False
        }
    
    # Store the trade using trade ID
    trade_id = request.json["_id"]["$oid"]
    on_going_trades[trade_id] = trades
    print("ongoin trades", on_going_trades)
    return sanic_json({"status": "Trade initialized"}, status=200)

def create_payload(data):
    """
    Transforms the input data into a list of dictionaries with 'add', 'drop', and simplified 'cookies'.
    
    Parameters:
        data (dict): The input data containing user information with 'add', 'drop', and 'cookies'.
        
    Returns:
        list: A list of dictionaries, each representing an email entry with 'add', 'drop', and 'cookies'.
    """
    payload = []
    
    for email, details in data.items():
        # Convert 'add' and 'drop' from strings to integers
        try:
            add_value = int(details.get('add', 0))
        except ValueError:
            add_value = 0  # Default value or handle as needed
        
        try:
            drop_value = int(details.get('drop', 0))
        except ValueError:
            drop_value = 0  # Default value or handle as needed
        
        # Extract cookies with only 'name' and 'value'
        cookies = {}
        for cookie in details.get('cookies', []):
            name = cookie.get('name')
            value = cookie.get('value')
            if name and value:
                cookies[name] = value
        
        # Create the entry dictionary
        entry = {
            "add": add_value,
            "drop": drop_value,
            "cookies": cookies
        }
        
        payload.append(entry)
    
    return payload


@app.websocket("/ws")
async def websocket_handler(request, ws):
    trade_id = None
    user_id = None
    while True:
        data = await ws.recv()
        data = json.loads(data)
        print("RECIEVED", data)
        if data["type"] == "join_trade":
            trade_id = data["trade_id"]
            user_id = data["user_id"]
            if trade_id not in connected_clients:
                connected_clients[trade_id] = []
            connected_clients[trade_id].append(ws)
            if trade_id in on_going_trades:
                # Send the trade data to the user
                await ws.send(json.dumps({"type": "trade_data", "trade": on_going_trades[trade_id]}))
            else:
                await ws.send(json.dumps({"type": "error", "message": "Trade not found"}))
        elif data["type"] == "trade_ready":
            print("SOJMEONE IS READYADSF")
            # Update the trade data
            on_going_trades[data["trade_id"]][data["user_id"]]["cookies"] = json.loads(data["cookies"])            
            on_going_trades[data["trade_id"]][data["user_id"]]["ready"] = True
            # Broadcast updated trade data to all clients in this trade
            trade_clients = connected_clients.get(data["trade_id"], [])
            for client_ws in trade_clients:
                await client_ws.send(json.dumps({"type": "trade_data", "trade": on_going_trades[data["trade_id"]]}))
            # Check if all users are ready
            if all(user_data["ready"] for user_data in on_going_trades[data["trade_id"]].values()):
                # remove the trade from on_going_trades

                print("\n\n\n\n\n")
                print("WILL SEND THIS ", on_going_trades[data["trade_id"]])
                print("\n\n\n\n\n")

                requests.post(f"https://api.hokieswap.com/swaps/{data['trade_id']}/ready", json=create_payload(on_going_trades[data["trade_id"]]))
                
                del on_going_trades[data["trade_id"]]
                # Broadcast end trade to all clients in this trade
                for client_ws in trade_clients:
                    await client_ws.send(json.dumps({"type": "end_trade"}))


                

                


                

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000,   auto_reload=True)



