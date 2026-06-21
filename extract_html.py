import json
import csv
from bs4 import BeautifulSoup

file_path = r"C:\Users\iftaf\.gemini\antigravity-ide\brain\a70e0b6f-1887-4666-9273-489fb5bc259f\.system_generated\steps\7\content.md"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

soup = BeautifulSoup(content, 'html.parser')

name = "Antigravity A1 8K 360 Drone Infinity Bundle"
short_desc = "Shoot 360 without your drone photobombing. Antigravity A1's camera lenses are precisely positioned at the top and bottom of the drone, and an advanced 360 image-stitching algorithm powered by Insta360 makes the drone fully invisible."

description_tab = soup.find('div', id='tab-description')
if description_tab:
    # remove the heading of the tab if it exists
    desc_html = "".join([str(x) for x in description_tab.contents]).strip()
else:
    desc_html = ""

price = "310000"
weight = "1.5"
categories = "Drone Bundles, Ready-To-Fly Drones"
tags = "8k, Antigravity, Antigravity A1"
images = "https://www.robotonbd.com/wp-content/uploads/2026/02/Antigravity-A1-8K-360-Drone-Infinity-Bundle-Antigravity-157184887_1200x.png, https://www.robotonbd.com/wp-content/uploads/2026/02/Antigravity-A1-8K-360-Drone-Explorer-Bundle-Antigravity-157118281_1200x.jpg, https://www.robotonbd.com/wp-content/uploads/2026/02/Antigravity-A1-8K-360-Drone-Explorer-Bundle-Antigravity-157118393_1200x.png, https://www.robotonbd.com/wp-content/uploads/2026/02/Antigravity-A1-8K-360-Drone-Explorer-Bundle-Antigravity-157118481_1200x.png, https://www.robotonbd.com/wp-content/uploads/2026/02/Antigravity-A1-8K-360-Drone-Infinity-Bundle-Antigravity-157184186_1200x.png, https://www.robotonbd.com/wp-content/uploads/2026/02/Antigravity-A1-8K-360-Drone-Explorer-Bundle-Antigravity-157118118_2880x.jpg"

row = {
    "ID": "",
    "Type": "simple",
    "SKU": "",
    "GTIN, UPC, EAN, or ISBN": "",
    "Name": name,
    "Published": "1",
    "Is featured?": "0",
    "Visibility in catalog": "visible",
    "Short description": short_desc,
    "Description": desc_html,
    "Date sale price starts": "",
    "Date sale price ends": "",
    "Tax status": "taxable",
    "Tax class": "",
    "In stock?": "backorder",
    "Stock": "",
    "Low stock amount": "",
    "Backorders allowed?": "notify",
    "Sold individually?": "0",
    "Weight (kg)": weight,
    "Length (cm)": "",
    "Width (cm)": "",
    "Height (cm)": "",
    "Allow customer reviews?": "1",
    "Purchase note": "",
    "Sale price": "",
    "Regular price": price,
    "Categories": categories,
    "Tags": tags,
    "Shipping class": "",
    "Images": images
}

headers = ["ID","Type","SKU","GTIN, UPC, EAN, or ISBN","Name","Published","Is featured?","Visibility in catalog","Short description","Description","Date sale price starts","Date sale price ends","Tax status","Tax class","In stock?","Stock","Low stock amount","Backorders allowed?","Sold individually?","Weight (kg)","Length (cm)","Width (cm)","Height (cm)","Allow customer reviews?","Purchase note","Sale price","Regular price","Categories","Tags","Shipping class","Images","Download limit","Download expiry days","Parent","Grouped products","Upsells","Cross-sells","External URL","Button text","Position","Brands","Attribute 1 name","Attribute 1 value(s)","Attribute 1 visible","Attribute 1 global"]

# Ensure row has all headers
for h in headers:
    if h not in row:
        row[h] = ""

with open(r"D:\Projects\E-Com\new_product.csv", "w", newline='', encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=headers)
    writer.writeheader()
    writer.writerow(row)

print("Created new_product.csv successfully")
