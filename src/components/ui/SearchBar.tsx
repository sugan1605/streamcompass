// Simple reusable search bar used on Home.
// Handles text search + press-and-hold voice search.

import React from "react";
import {
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  Text,
} from "react-native";
import { MagnifyingGlass, X, Microphone } from "phosphor-react-native";

export type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  loading?: boolean;
  onClear?: () => void;
  // Voice search handlers (press and hold)
  onMicPressIn?: () => void;
  onMicPressOut?: () => void;
  isListening?: boolean;
};

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Search by title…", // TODO: Expand to actors / genres later
  loading = false,
  onClear,
  onMicPressIn,
  onMicPressOut,
  isListening = false,
}: SearchBarProps) {
  // Checks if user has typed anything
  const hasText = value.trim().length > 0;

  // Clears query and optional external state
  const handleClear = () => {
    onChangeText("");
    onClear?.();
  };

  return (
    <View className="mb-3 flex-row items-center rounded-2xl border border-slate-800 bg-slate-900/95 px-3 py-2">
      {/* Left search icon */}
      <View className="mr-2">
        <MagnifyingGlass size={16} color="#94a3b8" weight="bold" />
      </View>

      {/* Input field */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#64748b"
        className="flex-1 px-1 text-sm text-slate-100"
        style={{ paddingVertical: 0}}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
      />

      {/* Right side controls */}
      <View className="ml-2 flex-row items-center gap-1">
        {/* Loader while TMDB search is running */}
        {loading && (
          <ActivityIndicator size="small" color="#22c55e" />
        )}

        {/* Clear button when there is text and not loading */}
        {!loading && hasText && (
          <Pressable
            onPress={handleClear}
            hitSlop={8}
            className="h-6 w-6 items-center justify-center rounded-full bg-slate-700/80"
          >
            <X size={14} color="#e5e7eb" weight="bold" />
          </Pressable>
        )}

        {/* Mic button – press and hold to speak */}
        <Pressable
          onPressIn={onMicPressIn}
          onPressOut={onMicPressOut}
          disabled={loading}
          hitSlop={8}
          className={`h-7 w-7 items-center justify-center rounded-full ${
            isListening ? "bg-emerald-500/90" : "bg-slate-700/80"
          }`}
        >
          <Microphone
            size={14}
            color={isListening ? "#0f172a" : "#e5e7eb"}
            weight={isListening ? "fill" : "bold"}
          />
        </Pressable>
      </View>
    </View>
  );
}
