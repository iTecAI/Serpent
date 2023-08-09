from tinydb.table import Table
from components import SearchComponent, ComponentError
from server.typings import SEARCH_TERMS, SearchResult
from typings import *
from requests import Session
from urllib.parse import urlencode
from json import JSONDecodeError

HEADERS = {
    "Host": "apibay.org",
    "Origin": "https://thepiratebay.org",
    "User-Agent": "Mozilla/5.0 (Linux; Android 8.1.0; SM-J710MN Build/M1AJQ) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3882.0",
}

CATEGORIES = {
    "200": "All Video",
    "201": "Movies",
    "202": "Movies : DVDR",
    "203": "Music Videos",
    "204": "Movie Clips",
    "205": "TV Shows",
    "206": "Handheld",
    "207": "Movies : HD",
    "208": "TV Shows : HD",
    "209": "3D Video",
    "210": "CAM/TS",
    "211": "Movies : UHD/4K",
    "212": "TV Shows : UHD/4K",
    "299": "Other Video",
}

TRACKERS = [
    "udp://tracker.coppersurfer.tk:6969/announce",
    "udp://tracker.openbittorrent.com:6969/announce",
    "udp://tracker.bittor.pw:1337/announce",
    "udp://tracker.opentrackr.org:1337",
    "udp://bt.xxx-tracker.com:2710/announce",
    "udp://public.popcorn-tracker.org:6969/announce",
    "udp://eddie4.nl:6969/announce",
    "udp://tracker.torrent.eu.org:451/announce",
    "udp://p4p.arenabg.com:1337/announce",
    "udp://tracker.tiny-vps.com:6969/announce",
    "udp://open.stealth.si:80/announce",
]


def sizeof_fmt(num, suffix="B"):
    for unit in ("", "Ki", "Mi", "Gi", "Ti", "Pi", "Ei", "Zi"):
        if abs(num) < 1024.0:
            return f"{num:3.1f}{unit}{suffix}"
        num /= 1024.0
    return f"{num:.1f}Yi{suffix}"


class PirateBaySearch(SearchComponent):
    media_types = ["movie", "video", "tv"]
    additional_fields = [
        SearchField_Selection(
            type="selection",
            key="category",
            options=CATEGORIES,
            multiple=False,
            label="Search Category",
        )
    ]

    def __init__(self, plugin_data: PluginMeta, table: Table) -> None:
        super().__init__(plugin_data, table)
        self.healthy = True
        self.session = Session()

    def search(
        self, general: str, fields: dict[str, SEARCH_TERMS]
    ) -> list[SearchResult]:
        results_raw = self.session.get(
            "https://apibay.org/q.php?"
            + urlencode({"q": general, "cat": fields.get("category", "200")}),
            headers=HEADERS,
        )
        if not results_raw.ok:
            raise ComponentError(
                self.plugin["id"],
                "pirate-bay-search",
                "Failed to retrieve data from PirateBay API",
            )
        processed_results = []
        try:
            for result in results_raw.json():
                try:
                    processed_results.append(
                        SearchResult(
                            plugin=self.plugin["id"],
                            download_type="torrent",
                            title=result["name"],
                            description=f"Category: {CATEGORIES.get(result.get('category', ''), 'All Video')} | Uploader: {result.get('username', 'Unknown')} | File Size: {sizeof_fmt(int(result.get('size', '0')))}",
                            download_uri="magnet:?"
                            + urlencode(
                                {
                                    "xt": "urn:btih:" + result["info_hash"],
                                    "dn": result["name"],
                                    "tr": TRACKERS
                                },
                                doseq=True
                            ),
                            extra_data={
                                "imdb_id": result.get("imdb", None),
                                "seeders": int(result.get("seeders", "0")),
                                "leechers": int(result.get("leechers", "0")),
                                "file_count": int(result.get("num_files", "0")),
                                "time": int(result.get("added", "0"))
                            }
                        )
                    )
                except KeyError:
                    pass
        except JSONDecodeError:
            raise ComponentError(
                self.plugin["id"], "pirate-bay-search", "Returned JSON is invalid"
            )

        return processed_results
