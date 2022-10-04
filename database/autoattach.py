import json

nativeurl = 'https://scorpion-finance.mypinata.cloud/ipfs/QmR1bLXTtCRu14SRAXoLuHfdv6PyYm1pv6yLxLUSBfR7my/';
fulldata = []

i = 0

for i in range(307):
    token_uri = nativeurl + str(i) + '.json'
    f = open('./metadata/' + str(i) + '.json',) 
    data = json.load(f)
    category = data["attributes"][0]["value"]
    if category == 'Super Founder':
        real_ct = 'super_founder'
        price = 20
    elif category == 'Founder':
        real_ct = 'founder'
        price = 5
    elif category == 'Rare':
        real_ct = 'rare'
        price = 2
    elif category == 'Limited Edition':
        real_ct = 'limited_edition'
        price = 1
    token = {
        "id": i + 1,
        "category": real_ct,
        "status": "not_mint",
        "item_type": data["type"],
        "collections": "ScorpionNFT",
        "title": data["title"],
        "price": price,
        "description": data["description"],
        "token_uri": token_uri,
        "img_url": data["image"],
    }
    fulldata.append(token)

# print(fulldata)
    with open('./full.json', 'w') as outfile:
        json.dump(fulldata, outfile, indent=4)