import csv
import re
import unicodedata

def slugify(s):
    s = unicodedata.normalize('NFD', s)
    s = re.sub(r'[^\w\s-]', '', s).strip().lower()
    return re.sub(r'[\s]+', '-', s)

updates = []
seen = set()

with open('products.csv', encoding='utf-8', errors='replace') as f:
    reader = csv.DictReader(f)
    for row in reader:
        name = (row.get('Name') or '').strip()
        images = (row.get('Images') or '').strip()
        typ = (row.get('Type') or '').strip().lower()
        if not name or not images or typ == 'variation':
            continue
        img = images.split(',')[0].strip()
        if len(img) > 500:
            img = img[:500]
        if not img:
            continue
        slug = slugify(name)
        if not slug or slug in seen:
            continue
        seen.add(slug)
        img_esc = img.replace("'", "''")
        slug_esc = slug.replace("'", "''")
        updates.append("UPDATE products SET image_url='{}' WHERE slug='{}';".format(img_esc, slug_esc))

print('Total updates: {}'.format(len(updates)))
with open('update_images.sql', 'w', encoding='utf-8') as out:
    out.write('\n'.join(updates))
print('Written to update_images.sql')
