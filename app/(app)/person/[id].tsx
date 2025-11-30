// Detail screen for a person (actor/crew) fetched from TMDB

import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";

import { TMDB_CONFIG } from "@/src/config/tmdb";
import { PersonDetails } from "@/src/types/movies";

export default function PersonScreen() {
  // Expo Router passes the TMDB person id via the dynamic route /person/[id]
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch person details from TMDB whenever the id changes
  useEffect(() => {
    if (!id) {
      setError("No person id");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${TMDB_CONFIG.baseUrl}/person/${id}?api_key=${TMDB_CONFIG.apiKey}&language=en-US`
        );

        if (!res.ok) {
          setError("Could not load person details");
          return;
        }

        const data = await res.json();
        setPerson(data);
      } catch (e) {
        console.log("Error loading person:", e);
        setError("Could not load person details");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-1 items-center justify-center px-6">
          <ActivityIndicator />
          <Text className="mt-3 text-sm text-gray-500">Loading person...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error or missing person
  if (error || !person) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-3 text-center text-lg font-semibold text-red-700">
            {error ?? "Person not found."}
          </Text>
          <Pressable
            onPress={handleBack}
            className="rounded-full border border-slate-900 bg-white px-4 py-2"
          >
            <Text className="text-sm font-medium text-slate-900">Go back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const profileUri = person.profile_path
    ? `${TMDB_CONFIG.imageBaseUrl}${person.profile_path}`
    : null;

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView
        className="px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Back */}
        <Pressable
          onPress={handleBack}
          hitSlop={12}
          className="mb-4 flex-row items-center"
        >
          <Text className="mr-1 text-lg text-slate-900">←</Text>
          <Text className="text-base font-medium text-slate-900">Back</Text>
        </Pressable>

        {/* Header */}
        <View className="mb-6 flex-row">
          {profileUri ? (
            <Image
              source={{ uri: profileUri }}
              className="h-24 w-24 rounded-full bg-gray-200"
            />
          ) : (
            <View className="h-24 w-24 items-center justify-center rounded-full bg-gray-200">
              <Text className="text-xs text-gray-400">N/A</Text>
            </View>
          )}

          <View className="ml-4 flex-1">
            <Text className="text-2xl font-bold text-slate-900">
              {person.name}
            </Text>

            {person.known_for_department && (
              <Text className="mt-0.5 text-[13px] text-gray-500">
                {person.known_for_department}
              </Text>
            )}

            {person.popularity !== undefined && (
              <Text className="mt-0.5 text-[13px] text-gray-500">
                Popularity: {person.popularity.toFixed(1)}
              </Text>
            )}

            {person.birthday && (
              <Text className="mt-0.5 text-[13px] text-gray-500">
                Born: {person.birthday}
              </Text>
            )}

            {person.place_of_birth && (
              <Text className="mt-0.5 text-[13px] text-gray-500">
                {person.place_of_birth}
              </Text>
            )}
          </View>
        </View>

        {/* Biography */}
        <Text className="mb-2 text-lg font-semibold text-slate-900">
          Biography
        </Text>
        <Text className="text-sm leading-5 text-slate-700">
          {person.biography && person.biography.trim().length > 0
            ? person.biography
            : "No biography available for this person."}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
