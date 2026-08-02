import mysql.connector

try:
    conn = mysql.connector.connect(
        host="gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
        port=4000,
        user="fayxknEDQC42KGU.root",
        password="5QFMIWHEY7XqBG0Z",
        database="kings_tv_db"
    )
    cursor = conn.cursor()

    # Turn off foreign key checks temporarily to wipe tables
    cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
    cursor.execute("TRUNCATE TABLE categories;")
    
    # Insert new categories
    categories = [
        ("நம்ம ஊர்", "Regional", "our-town", 1, 1, 1),
        ("செய்திகள்", "News", "news", 1, 1, 2),
        ("வாழ்த்து", "Wishes", "wishes", 1, 1, 3),
        ("இரங்கல்", "Obituaries", "condolences", 1, 1, 4),
        ("வணிகம்", "Business", "business", 1, 1, 5),
        ("வேலை", "Jobs", "jobs", 1, 1, 6),
        ("தள்ளுபடி", "Classifieds", "classifieds", 1, 1, 7),
        ("வாங்க விற்க/<<", "Buy/Sell", "buy-sell", 1, 1, 8)
    ]
    
    insert_query = """
    INSERT INTO categories (name_ta, name, slug, is_nav, is_active, display_order)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    
    cursor.executemany(insert_query, categories)
    cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
    conn.commit()
    
    print("Database updated successfully!")
    
except Exception as e:
    print(f"Error: {e}")
finally:
    if 'conn' in locals() and conn.is_connected():
        cursor.close()
        conn.close()
