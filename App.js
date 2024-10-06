import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';

const ACCESS_TOKEN = 'your access token'; // Access token

export default function App() {
  const [quote, setQuote] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [loading, setLoading] = useState(false);

  const getRandomQuote = async () => {
    try {
      setLoading(true); 
      // Get total number of quotes
      const totalResponse = await fetch('https://the-one-api.dev/v2/quote?limit=1', {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      });
      const totalData = await totalResponse.json();
      const totalQuotes = totalData.total;

      // Generate random offset
      const randomOffset = Math.floor(Math.random() * totalQuotes);

      // Random quote
      const response = await fetch(
        `https://the-one-api.dev/v2/quote?limit=1&offset=${randomOffset}`,
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        }
      );
      const data = await response.json();
      const randomQuote = data.docs[0];

      // Get character name from character id
      const characterId = randomQuote.character;
      const characterResponse = await fetch(
        `https://the-one-api.dev/v2/character/${characterId}`,
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        }
      );
      const characterData = await characterResponse.json();
      const character = characterData.docs[0];


      setQuote(randomQuote.dialog);
      setCharacterName(character.name);
    } catch (error) {
      console.error(error);
      setQuote('Error fetching quote');
      setCharacterName('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>The Lord of the Rings Quote Randomizer</Text>
      <View style={styles.content}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <>
            <Text style={styles.quoteText}>"{quote}"</Text>
            {characterName ? (
              <Text style={styles.characterText}>- {characterName}</Text>
            ) : null}
          </>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={getRandomQuote}>
          <Text style={styles.buttonText}>Get random quote</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', 
    alignItems: 'center',
  },
  title: {
    marginTop: 50,
    fontSize: 24,
    color: '#FFFFFF', 
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  quoteText: {
    fontSize: 20,
    color: '#FFFFFF', 
    textAlign: 'center',
    fontStyle: 'italic',
  },
  characterText: {
    marginTop: 10,
    fontSize: 18,
    color: '#FFFFFF', 
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginBottom: '33%', 
    width: '80%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FFFFFF', 
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000', 
    fontSize: 16,
    fontWeight: 'bold',
  },
});