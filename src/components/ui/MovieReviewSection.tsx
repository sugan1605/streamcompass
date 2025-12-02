/**
 * MovieReviewSection
 * Renders user reviews with sorting + filtering using UISegmentedControl.
 * Wraps ReviewItem and applies StreamCompass styling logic.
 */

import { useMemo, useState } from "react";
import { View, Text } from "react-native";

import { Review } from "@/src/types/movies";
import { UISegmentedControl } from "@/src/components/ui/UISegmentedControl";
import { UISectionHeader } from "@/src/components/ui/UISectionHeader";
import { ReviewItem } from "@/src/components/ReviewItem";

type Props = {
  reviews: Review[];
};

type SortBy = "recent" | "rating";
type Filter = "all" | "positive" | "neutral" | "negative";

export function MovieReviewSection({ reviews }: Props) {
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [reviewFilter, setReviewFilter] = useState<Filter>("all");

  const filteredReviews = useMemo(() => {
    const sorted = [...reviews].sort((a, b) => {
      if (sortBy === "recent") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      const aRating = a.rating ?? 0;
      const bRating = b.rating ?? 0;
      return bRating - aRating;
    });

    return sorted.filter((rev) => {
      const rating = rev.rating;
      if (reviewFilter === "all") return true;
      if (rating === null || rating === undefined) return true;

      if (reviewFilter === "positive") return rating >= 7;
      if (reviewFilter === "neutral") return rating >= 4 && rating < 7;
      if (reviewFilter === "negative") return rating < 4;

      return true;
    });
  }, [reviews, sortBy, reviewFilter]);

  if (filteredReviews.length === 0) return null;

  return (
    <View className="mt-6">
      <UISectionHeader
        title="User Reviews"
        rightElement={
          <UISegmentedControl
            options={[
              { value: "recent", label: "Recent" },
              { value: "rating", label: "Rating" },
            ]}
            value={sortBy}
            onChange={(val) => setSortBy(val as SortBy)}
            size="sm"
          />
        }
      />

      <UISegmentedControl
        options={[
          { value: "all", label: "All" },
          { value: "positive", label: "👍 Positive" },
          { value: "neutral", label: "😐 Neutral" },
          { value: "negative", label: "👎 Negative" },
        ]}
        value={reviewFilter}
        onChange={(val) => setReviewFilter(val as Filter)}
        className="mt-1"
        size="md"
      />

      <View className="mt-2">
        {filteredReviews.slice(0, 6).map((rev) => (
          <ReviewItem
            key={rev.id}
            author={rev.author}
            rating={rev.rating ?? null}
            content={rev.content}
            createdAt={rev.createdAt}
          />
        ))}
      </View>
    </View>
  );
}
