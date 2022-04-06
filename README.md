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
###### This process will be automated once the application is deployed
