import pymysql
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = pymysql.connect(host='localhost', user='root', password='', database='roboxpressbd')
cursor = conn.cursor(pymysql.cursors.DictCursor)

cursor.execute("""
    SELECT p.id, p.name, p.price, p.slug, p.stock, p.active
    FROM products p
    JOIN product_categories pc ON pc.product_id = p.id
    WHERE pc.category_id = 21
    AND (
        p.name LIKE '%HOTA%' OR
        p.name LIKE '%ToolkitRC%' OR
        p.name LIKE '%iSDT%'
    )
    ORDER BY p.id
""")
products = cursor.fetchall()
print(f"Found {len(products)} products:")
for p in products:
    print(f"  [{p['id']}] {p['name']} - {p['price']} | stock={p['stock']} | active={p['active']}")

conn.close()
