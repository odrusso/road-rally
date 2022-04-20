from typing import List, Tuple
from dataclasses import dataclass
import matplotlib.pyplot as plt
import matplotlib.animation as animation
import matplotlib.patches as mpatches
from mpl_toolkits.basemap import Basemap
import numpy as np
from functools import cache
from datetime import datetime


locations_file = open("locations.csv").readlines()
locations_map = [_.rstrip().split(",") for _ in locations_file]

teams = ["Fabulous", "Nick and Nick", "Mc Chicken"]

team_checkins = {}

@dataclass
class Coordinate:
    long: float
    lat: float


@dataclass
class Checkin:
    id: int
    teamName: str
    location: Coordinate
    time: int


def load_checkins() -> List[Checkin]:
    checkins_file = open("checkins.csv").readlines()
    chekins_map = [_.rstrip().split(",") for _ in checkins_file]

    checkin_objects = [ Checkin(id=s[0], teamName=s[1], location=get_coordinate(s[2]), time=int(s[3])) for s in chekins_map ]

    for team in teams:
        team_checkins[team] = []

    for checkin in sorted(checkin_objects, key= lambda x: x.time):
        team_checkins[checkin.teamName].append(checkin)

    return sorted(checkin_objects, key= lambda x: x.time)


@cache
def get_coordinate(name: str) -> Coordinate:
    for location in locations_map:
        if location[0] == name:
            return Coordinate(float(location[1]), float(location[2]))

    raise Exception(f"Location not found for {name}")


def plot_maccas_locations(basemap):
    for location in locations_map:
        basemap.scatter(float(location[2]), float(location[1]),marker='o',color='r', latlon=True)


def get_longlat_at_time(time: float, teamName: str) -> Coordinate:
    all_checkins_for_team = team_checkins[teamName]
    # sorted_checkins = sorted(all_checkins_for_team, key= lambda x: x.time)

    previous_checkin, next_checkin = get_checkins_at_time(all_checkins_for_team, time)

    # Can stop animating a path if there is nothing left to go
    if previous_checkin is None:
        return Coordinate(0, 0)

    start_time = previous_checkin.time
    end_time = next_checkin.time

    if end_time - start_time == 0:
        return Coordinate(0, 0)

    how_far_through = (time - start_time) / (end_time - start_time)

    # Create a vector that represents the difference between the two points
    point_delta = Coordinate(next_checkin.location.long - previous_checkin.location.long, next_checkin.location.lat - previous_checkin.location.lat)

    # Get the point hft * delta
    current_delta = Coordinate(point_delta.long * how_far_through, point_delta.lat * how_far_through)

    # Add that to the start point to get location
    return Coordinate(previous_checkin.location.long + current_delta.long, previous_checkin.location.lat + current_delta.lat)


def get_checkins_at_time(checkins: List[Checkin], time: int) -> Tuple[Checkin, Checkin]:
    # Before any movement
    if time < checkins[0].time:
        return checkins[0], checkins[0]

    for i, _ in enumerate(checkins):
        # At the end of the list
        if i + 1 >= len(checkins):
            return None, None
            
        # In a nice middle ground
        # After the last one, but before the next one
        if checkins[i].time < time and checkins[i + 1].time > time:
            return checkins[i], checkins[i + 1]

    raise Exception("Couldn't find a checkin")


@cache
def tick_to_time(tick):
    base = 1650058200000
    # time is in ms, and 1 tick = 30 seconds minute
    return base + (tick * 500 * 60)


@cache
def get_team_color(teamName: str) -> str:
    match teamName:
        case "Fabulous": 
            return "purple"
        case "Nick and Nick":
            return "black"
        case "Mc Chicken":
            return "blue"


def setup_legend(m):
    patches = [mpatches.Patch(color=get_team_color(team), label=team) for team in teams]
    m.legend(handles=patches)


def update_plot_time(m, tick):
    string_time = datetime.fromtimestamp(tick_to_time(tick) // 1000).strftime("%I:%M:%S %p")
    m.suptitle(string_time)


def animate(tick, m, fig):
    print(tick)

    update_plot_time(fig, tick)

    for team in teams:
        current_location = get_longlat_at_time(tick_to_time(tick), team)
        # last_location = get_longlat_at_time(tick_to_time(tick - 1), team, all_checkins)

        # m.quiver(last_location.lat, last_location.long, current_location.lat, current_location.long, latlon=True)
        m.scatter(current_location.lat, current_location.long, s=1, marker='o',color=get_team_color(team), latlon=True)


# TODO
if __name__ == "__main__":
    # all_checkings = load_checkins()
    load_checkins()

    fig = plt.figure(figsize=(10, 8))

    N = 120 * 4  # s1 tick per 30s, for 4 hours
    # N = 5

    # m = Basemap(projection='tmerc', resolution="f",
    #         width=2E4, height=2E4, 
    #         lat_0=-43.5, lon_0=172.6)

    # For NZ
    # ll -47.6231617528111, 163.10715459735397
    # ur -33.47005137211478, -179.17747503435464

    # GOOD VALUES FOR CHCH CYL
    # m = Basemap(projection="cyl", resolution="h",
    #     llcrnrlon=172.5, llcrnrlat=-43.6, 
    #     urcrnrlon=172.8, urcrnrlat=-43.4)

    m = Basemap(projection="cyl", resolution="h",
    llcrnrlon=172.5, llcrnrlat=-43.6, 
    urcrnrlon=172.75, urcrnrlat=-43.45)

    # m.drawcoastlines()
    # m.drawmapboundary(fill_color='blue')
    # m.fillcontinents(color='green',lake_color='blue')
    # m.drawrivers(color='blue')

    # time_label = m.text(0, 0, "test")

    # m.arcgisimage(service='World_Shaded_Relief', xpixels = 6000, verbose=True)
    m.arcgisimage(service='World_Street_Map', xpixels = 6000, verbose=True)


    plot_maccas_locations(m)

    setup_legend(fig)

    # 33ms between frames, aka 30fps
    anim=animation.FuncAnimation(fig, lambda x: animate(x, m, fig), frames=N, interval=33, repeat=False)

    # plt.show()

    f = r"./test.mp4" 
    writervideo = animation.FFMpegWriter(fps=15) 
    anim.save(f, writer=writervideo)

    # - todos -
    # performance improvement, give each team a multiline, and just add onto it rather than adding a new plot
    # update basemap
    # maybe swap to cartopy?
