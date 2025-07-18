document.addEventListener('DOMContentLoaded', () => {
    const sentences = [
        "I like to play with my toys.",
        "The sun is shining brightly today.",
        "My cat sleeps on the sofa.",
        "We eat dinner at six o'clock.",
        "The flowers are pretty in the garden.",
        "I can jump very high!",
        "My favorite color is blue.",
        "The dog barks at the mailman.",
        "I brush my teeth every morning.",
        "We go to the park on Sundays.",
        "The baby laughs at the funny faces.",
        "I help my mom set the table.",
        "The birds sing sweet songs.",
        "My school bag is heavy with books.",
        "We watch cartoons on TV.",
        "The cookies smell delicious!",
        "I wear my red rain boots when it's wet.",
        "My brother shares his candy with me.",
        "The butterfly lands on the flower.",
        "I draw pictures with crayons.",
        "We build a sandcastle at the beach.",
        "The moon is big and round tonight.",
        "I give my friend a birthday present.",
        "The teacher reads us a story.",
        "My dad makes yummy pancakes."
    ];
    
    const sentenceDisplay = document.getElementById('sentenceDisplay');
    const randomButton = document.getElementById('randomButton');
    const counterDisplay = document.getElementById('counter');
    
    let remainingSentences = [...sentences];
    
    function getRandomSentence() {
        if (remainingSentences.length === 0) {
            return null;
        }
        
        const randomIndex = Math.floor(Math.random() * remainingSentences.length);
        const selectedSentence = remainingSentences[randomIndex];
        
        // Remove the selected sentence from the array
        remainingSentences.splice(randomIndex, 1);
        
        return selectedSentence;
    }
    
    function updateCounter() {
        counterDisplay.textContent = `Sentences left: ${remainingSentences.length}`;
    }
    
    randomButton.addEventListener('click', () => {
        playGameAudio('game-audio-ding');

        if (remainingSentences.length === 0) {
            sentenceDisplay.textContent = "All sentences have been shown!";
            randomButton.disabled = true;
            return;
        }
        
        // Add animation class
        sentenceDisplay.classList.add('animate');
        
        // Show "shuffling" message during animation
        sentenceDisplay.textContent = "Shuffling sentences...";
        
        // After animation, show the random sentence
        setTimeout(() => {
            const randomSentence = getRandomSentence();
            sentenceDisplay.textContent = randomSentence;
            sentenceDisplay.classList.remove('animate');
            updateCounter();
            
            if (remainingSentences.length === 0) {
                randomButton.disabled = true;
            }
        }, 500);
    });
    
    // Initialize counter
    updateCounter();
});