// // USE VOICE SEARCH ------------------------------------------------||


// // Handles press-and-hold voice search using react-native-voice.

// import { useEffect, useState, useCallback } from "react";
// //import Voice from "@react-native-voice/voice";

// type UseVoiceSearchOptions = {
//   // Called when we have a final recognized text
//   onResult: (text: string) => void;
// };

// export function useVoiceSearch({ onResult }: UseVoiceSearchOptions) {
//   const [isListening, setIsListening] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Handles incoming speech results from native side
//   const handleSpeechResults = useCallback(
//     (event: any) => {
//       const text = event?.value?.[0] ?? "";
//       if (!text) return;
//       onResult(text);
//     },
//     [onResult]
//   );

//   // Handles speech errors from native side
//   const handleSpeechError = useCallback((event: any) => {
//     const message = event?.error?.message ?? "Voice recognition error.";
//     setError(message);
//     setIsListening(false);
//   }, []);

//   // Sets up + cleans up voice listeners
//   useEffect(() => {
//     Voice.onSpeechResults = handleSpeechResults;
//     Voice.onSpeechError = handleSpeechError;

//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners).catch(() => {});
//     };
//   }, [handleSpeechResults, handleSpeechError]);

//   // Starts listening with configured locale
//   const startListening = async () => {
//     setError(null);
//     try {
//       setIsListening(true);
//       await Voice.start("en-US");
//     } catch (e) {
//       console.log("Voice start error:", e);
//       setIsListening(false);
//       setError("Could not start voice recognition.");
//     }
//   };

//   // Stops listening and finalizes recognition
//   const stopListening = async () => {
//     try {
//       await Voice.stop();
//     } catch (e) {
//       console.log("Voice stop error:", e);
//     } finally {
//       setIsListening(false);
//     }
//   };

//   return {
//     isListening,
//     startListening,
//     stopListening,
//     voiceError: error,
//   };
// }
