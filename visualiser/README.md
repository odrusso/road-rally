A little Python 3.10 script that will pump out a visualsation of the event.

## Prereqs
- ffmpeg, geolib, matplotlib, basemap, basemap_data

## How to use
- Grab the locations and the checkins from the road-rally DB and put them into two csv in this directory
- `python3 plot.py`
- You'll get an mp4

## TODO
- Create a bounding box dynamically from the points in locations.csv
- Create start-and-end times dynamically from checkins.csv
- Get all teams dynamically from checkins.csv
- Create team colors more intelligently
- Performance improvement, currently is O(n**2), but of a pain
- Read from the DB
- Read from the DBv2 (multi-tennant)
