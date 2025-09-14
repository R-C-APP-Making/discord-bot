import requests
from bs4 import BeautifulSoup
import csv
import os

def scrape_pokemon_data():
    """
    Scrapes Pokémon data (ID, name, image URL) from Bulbapedia and saves it to a CSV file.
    It will first try to load from a local HTML file if it exists.
    """
    URL = "https://bulbapedia.bulbagarden.net/wiki/List_of_Pokémon_by_National_Pokédex_number"
    LOCAL_FILE = "List of Pokémon by National Pokédex number - Bulbapedia, the community-driven Pokémon encyclopedia.html"
    
    soup = None

    # Prioritize using the local HTML file if it exists for consistent testing.
    if os.path.exists(LOCAL_FILE):
        print(f"Found local file '{LOCAL_FILE}'. Parsing from file...")
        try:
            with open(LOCAL_FILE, 'r', encoding='utf-8') as f:
                soup = BeautifulSoup(f, "html.parser")
        except Exception as e:
            print(f"Error reading local file: {e}")
            return
    else:
        print("Local file not found. Sending request to Bulbapedia...")
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        try:
            response = requests.get(URL, headers=headers)
            response.raise_for_status()
            print("Successfully fetched the page. Parsing HTML content...")
            soup = BeautifulSoup(response.content, "html.parser")
        except requests.exceptions.RequestException as e:
            print(f"Error fetching the URL: {e}")
            return

    if not soup:
        print("Could not create a soup object from either local file or URL.")
        return
        
    pokemon_data = []
    
    # Find the main content area to avoid grabbing unrelated tables.
    content_div = soup.find(id="mw-content-text")
    if not content_div:
        print("Could not find the main content div. The page structure might have changed.")
        return
        
    # Find all tables that are identified as Pokémon lists by their specific class.
    all_pokemon_tables = content_div.find_all('table', class_='roundy')
    
    if not all_pokemon_tables:
        print("Could not find any Pokémon data tables.")
        return

    for table in all_pokemon_tables:
        # Skip the header row
        rows = table.find_all("tr")[1:]
        
        for row in rows:
            cols = row.find_all("td")
            
            # Ensure the row has enough columns
            if len(cols) > 2:
                try:
                    pokedex_id = cols[0].get_text(strip=True)
                    
                    # --- MODIFIED SECTION FOR LARGER IMAGES ---
                    image_tag = cols[1].find("img")
                    image_url = ''
                    if image_tag and 'src' in image_tag.attrs:
                        thumb_url = image_tag['src']
                        # Reconstruct the URL to point to the full-size image instead of the thumbnail.
                        if '/thumb/' in thumb_url:
                            no_thumb_url = thumb_url.replace('/thumb', '')
                            # Remove the size specifier at the end of the URL
                            image_url = '/'.join(no_thumb_url.split('/')[:-1])
                        else:
                            # Fallback to the original src if the structure is unexpected
                            image_url = thumb_url
                    # --- END MODIFIED SECTION ---

                    pokemon_name_tag = cols[2].find("a")
                    pokemon_name = pokemon_name_tag.get_text(strip=True) if pokemon_name_tag else ''

                    if pokedex_id.startswith("#") and pokemon_name:
                        pokemon_data.append([pokedex_id, pokemon_name, image_url])
                        print(f"Scraped: {pokedex_id} - {pokemon_name}")

                except (AttributeError, IndexError):
                    # Silently skip any malformed rows
                    continue

    if not pokemon_data:
        print("Scraping finished, but no Pokémon data was found. The page structure has likely changed.")
        return

    print(f"\nTotal Pokémon scraped: {len(pokemon_data)}")
    
    output_dir = "output"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    output_file = os.path.join(output_dir, "pokemon_data.csv")
    
    print(f"Saving data to {output_file}...")
    
    try:
        with open(output_file, "w", newline="", encoding="utf-8") as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(["PokedexID", "Name", "ImageURL"])
            writer.writerows(pokemon_data)
        print("Data saved successfully!")
    except IOError as e:
        print(f"Error writing to file: {e}")

if __name__ == "__main__":
    scrape_pokemon_data()

