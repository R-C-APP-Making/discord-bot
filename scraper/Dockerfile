# Use an official lightweight Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container to /app
WORKDIR /app

# Copy the requirements file into the container at /app
# This is done first to leverage Docker's layer caching.
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application's code into the container at /app
COPY . .

# Run the scraper script when the container launches
CMD ["python", "bulbapedia_scraper.py"]
