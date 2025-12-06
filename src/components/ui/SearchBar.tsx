// Simple reusable search bar used on Home

import React from "react";
import {
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  Text,
} from "react-native";
import { MagnifyingGlass, X } from "phosphor-react-native";

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
  placeholder = "Search titles…", // TODO: Add actors / genres later
  loading = false,
  onClear,
}: SearchBarProps) {
  const hasText = value.trim().length > 0;

  const handleClear = () => {
    onChangeText("");
    onClear?.();
  };

  return (
    <View className="mb-3 flex-row items-center rounded-full border border-slate-800 bg-slate-900/90 px-3 py-1.5">
      {/* Left icon */}
      <View className="mr-2">
        <MagnifyingGlass size={16} color="#94a3b8" weight="bold" />
      </View>

      {/* Input */}
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

      {/* Right side: loader, clear or search text */}
      {loading ? (
        <ActivityIndicator size="small" color="#22c55e" />
      ) : hasText ? (
        <Pressable
          onPress={handleClear}
          hitSlop={8}
          className="ml-1 h-6 w-6 items-center justify-center rounded-full bg-slate-700/80"
        >
          <X size={14} color="#e5e7eb" weight="bold" />
        </Pressable>
      ) : (
        <Pressable onPress={onSubmit} hitSlop={8} className="ml-1">
          <Text className="text-[11px] font-semibold text-slate-300">
            Search
          </Text>
        </Pressable>
      )}
    </View>
  );
}
