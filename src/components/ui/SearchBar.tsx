// Simple reusable search bar used on Home

import React from "react";
import {
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  Text,
} from "react-native";
import { MagnifyingGlass, Microphone, X } from "phosphor-react-native";

export type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  loading?: boolean;
  onClear?: () => void;
};

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Search by title…", // later: actors / genres
  loading = false,
  onClear,
}: SearchBarProps) {
  const hasText = value.trim().length > 0;

  // Clear input + optional external reset
  const handleClear = () => {
    onChangeText("");
    onClear?.();
  };

  // Trigger search from button
  const handlePressSearch = () => {
    if (!loading) {
      onSubmit();
    }
  };

  return (
    <View className="mb-4 flex-row items-center">
      {/* Input pill */}
      <View className="flex-1 flex-row items-center rounded-full border border-slate-700 bg-slate-900/90 px-3 py-2 shadow-md shadow-black/40">
        {/* Left icon */}
        <View className="mr-2">
          <MagnifyingGlass size={18} color="#94a3b8" weight="bold" />
        </View>

        {/* Text input */}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#64748b"
          className="flex-1 px-1 text-sm text-slate-100"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={onSubmit}
        />

        {/* Right side icons inside pill */}
        {hasText && !loading && (
          <Pressable
            onPress={handleClear}
            hitSlop={8}
            className="mr-1 h-6 w-6 items-center justify-center rounded-full bg-slate-700/80"
          >
            <X size={12} color="#e5e7eb" weight="bold" />
          </Pressable>
        )}

        {/* Mic icon (visual only for now) */}
        <View className="h-7 w-7 items-center justify-center rounded-full bg-slate-800/90">
          <Microphone size={14} color="#a5b4fc" weight="bold" />
        </View>
      </View>

      {/* Search button pill */}
      <Pressable
        onPress={handlePressSearch}
        disabled={loading}
        className={`ml-3 rounded-full px-4 py-2.5 shadow-lg shadow-emerald-900/40 ${
          loading ? "bg-emerald-500/70" : "bg-emerald-500"
        }`}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#0b1120" />
        ) : (
          <Text className="text-xs font-semibold text-slate-950">Search</Text>
        )}
      </Pressable>
    </View>
  );
}
