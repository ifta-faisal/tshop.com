import json
from bs4 import BeautifulSoup

file_path = r"C:\Users\iftaf\.gemini\antigravity-ide\brain\a70e0b6f-1887-4666-9273-489fb5bc259f\.system_generated\steps\7\content.md"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

soup = BeautifulSoup(content, 'html.parser')

# Find the schema.org product data
schema_tags = soup.find_all('script', type='application/ld+json')
for tag in schema_tags:
    try:
        data = json.loads(tag.string)
        if isinstance(data, dict) and '@graph' in data:
            for item in data['@graph']:
                if item.get('@type') == 'Product':
                    print("--- SCHEMA DATA ---")
                    print(json.dumps(item, indent=2))
    except Exception as e:
        pass

# Also let's extract the main description text
description_div = soup.find('div', class_='woocommerce-product-details__short-description')
if description_div:
    print("\n--- SHORT DESCRIPTION ---")
    print(description_div.get_text(separator='\n').strip())

description_tab = soup.find('div', id='tab-description')
if description_tab:
    print("\n--- FULL DESCRIPTION ---")
    print(description_tab.get_text(separator='\n').strip())

price_p = soup.find('p', class_='price')
if price_p:
    print("\n--- PRICE ---")
    print(price_p.get_text(separator='\n').strip())
