import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { fetchAnimeById } from "../api/anilist";
import { CollectionItem } from "../api/collection";

interface AnimeDetails {
  id: number;
  title: { romaji: string; english?: string };
  coverImage?: {
    extraLarge: string;
    large: string;
    medium: string;
  };
  nextAiringEpisode?: { airingAt: number };
}

interface Props {
  item: CollectionItem;
}

const getCoverImage = (coverImage?: AnimeDetails["coverImage"]) => {
  return coverImage?.extraLarge || coverImage?.large || coverImage?.medium;
};

const getRelativeTime = (airingAt: number) => {
  const airDate = moment(airingAt * 1000);
  const now = moment();
  const diffMs = airDate.diff(now);
  if (diffMs <= 0) return null;

  const duration = moment.duration(diffMs);
  let timeText = "";
  let textColorClass = "";

  if (duration.asHours() < 24) {
    timeText = `${Math.ceil(duration.asHours())} hours`;
    textColorClass = "text-red-400"; // Softer red
  } else if (duration.asDays() < 7) {
    timeText = `${Math.ceil(duration.asDays())} days`;
    textColorClass = "text-yellow-400"; // Softer yellow
  } else if (duration.asDays() < 30) {
    timeText = `${Math.ceil(duration.asWeeks())} weeks`;
    textColorClass = "text-green-400"; // Softer green
  } else {
    const months = Math.floor(duration.asDays() / 30);
    timeText = `${months} month${months > 1 ? "s" : ""}`;
    textColorClass = "text-green-400"; // Softer green
  }
  return { timeText, textColorClass };
};

const CollectionItemCard: React.FC<Props> = ({ item }) => {
  const [animeDetails, setAnimeDetails] = useState<AnimeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details = await fetchAnimeById(item.anilistId);
        setAnimeDetails(details);
      } catch (error) {
        console.error("Error fetching anime details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [item.anilistId]);

  const handleClick = () => animeDetails && navigate(`/anime/${animeDetails.id}`);

  const relativeTimeInfo = useMemo(() => {
    if (animeDetails?.nextAiringEpisode) {
      return getRelativeTime(animeDetails.nextAiringEpisode.airingAt);
    }
    return null;
  }, [animeDetails]);

  if (loading) {
    return (
      <div className="border border-border rounded-md p-4 flex items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }
  if (!animeDetails) {
    return (
      <div className="border border-border rounded-md p-4 text-sm text-destructive">
        Error loading details
      </div>
    );
  }

  const coverImg = getCoverImage(animeDetails.coverImage);
  const title = animeDetails.title.english || animeDetails.title.romaji;

  return (
    <div
      onClick={handleClick}
      className="border border-border rounded-md overflow-hidden hover:shadow-md cursor-pointer transition flex flex-col gap-3 pb-2"
    >
      <div className="relative">
        {coverImg ? (
          <img src={coverImg} alt={title} className="w-full h-64 object-cover" />
        ) : (
          <div className="w-full h-64 flex items-center justify-center bg-muted">
            <span className="text-xs">No Image</span>
          </div>
        )}
        {animeDetails.nextAiringEpisode && relativeTimeInfo && (
          <div
            className="absolute top-0 left-0 right-0 text-center p-1"
            style={{
              background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2))",
              backdropFilter: "blur(8px)",
            }}
          >
            <span className={`text-xs font-semibold ${relativeTimeInfo.textColorClass}`}>
              In {relativeTimeInfo.timeText}
            </span>
          </div>
        )}
      </div>
      <div className="px-2">
        <h3 className="text-sm font-medium">{title}</h3>
        {animeDetails.nextAiringEpisode && (
          <div className="text-xs mt-2">
            <span className="inline-block bg-gray-200 text-gray-500 px-2 py-1 rounded-full">
              {moment(animeDetails.nextAiringEpisode.airingAt * 1000).format(
                "dddd Do MMM YYYY [at] hh:mma"
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionItemCard;
