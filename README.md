# wavenet-flask-react
A simple application to serve as an easy way to interact with our group's implementation of the WaveNet architecture for generating MIDI melodies. 

This is in partial fulfillment of my, Genrev Zapa's, and Ayin Medina's thesis, "Automatic Generation of Pop Melody Using a Neural Network Architecture based on WaveNet".

## Running the application
1. Clone the repo
2. Set-up the front-end
   1. `cd` to `./wavenet-flask-react/front-end`
   2. Install the front-end dependencies using `npm install`
   3. Build the static files using `npm run build`
3. Set-up the back-end
   1. `cd` to `../wavenet-flask-react/back-end`
   2. Initialize a virtual environment using `python -m venv venv` or `virtualenv venv`
   3. Activate the virtual environment using `./venv/Scripts/activate`
   4. Install the back-end dependencies using `pip install -r requirements.txt`
4. Run the server using `python ./server.py`

## Application Guide
### Pages
* The landing page
    * Features background information on the application
* Dashboard
    * The primary page for setting parameters and generating melodies

    ![Pop Melody AI dashboard](https://i.imgur.com/IRzwI4s.png)
    * User can select the type of instrument with which to play the generated melodies; the soundfonts are loaded from [Gleitz's MIDI.js soundfonts](https://gleitz.github.io/midi-js-soundfonts/)

    ![Pop Melody AI instrument selection](https://i.imgur.com/tKgQIXA.png)
    * The user will be notified if the instrument has been loaded
    ![Toast notification for instrument loading](https://i.imgur.com/6dH3Tkj.png)
    * Key can be selected to limit the kinds of notes that will appear on the melody/ies
    
    ![Selection of musical key](https://i.imgur.com/XTwOBbu.png)
    * The rhythm of the generated melodies can be altered by setting whether the generated notes all have the same duration or allowing the underlying model to decide the duration of the individual notes
    
    ![Rhythm characteristics](https://i.imgur.com/CzI69HI.png)
    * The duration of the individual melodies can also be influenced by selecting the number of notes to generate; a maximum of 100 notes can be generated and a minimum of 10
    ![Note count field](https://i.imgur.com/kX4tgTj.png)
    * Once the user has selected the parameters, they can generate the melodies by clicking the "Generate" button
    
    ![Generate button](https://i.imgur.com/MLcP0Zl.png)
    * After successfully generating melodies, the generated melodies are displayed in the table below the button
  
    ![Generated melodies](https://i.imgur.com/EcWoe7T.png)
    * The user can choose to download the MIDI files using the download button, or play the melodies using the play button
    * Upon clicking the play button, a modal will appear that displays information about the selected melody, such as the notes of the scale and the notes at each step along with the duration of the notes
    
    ![Play modal](https://i.imgur.com/3BROctf.png)
    * The user can adjust the playback speed and volume of the melody using the sliders below 
    
    ![Playback controls](https://i.imgur.com/64hOCeB.png)

