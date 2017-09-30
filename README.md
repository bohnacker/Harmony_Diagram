Harmony Diagram is a [p5.js](http://p5js.org) project that displays the relations of all 40 possible triads in 4D space.

## Explanation

Harmonies are one of the main elements of music. They appear when two ore more notes are played together. In western music, the basic harmonies are triads. That is when exactly three notes come together. Below you see two examples: a c major and a c minor chord.

![C major and c minor](readme_assets/1_c_major_minor.svg)

These two chords are quite closely related because you have to change only one note to get from one to the other. I wanted to know how a network structure would look like, if I connect all possible triads that differ only in one note. 

The first question was: how many triads are there? If you allow all possible combinations of the 12 tones in an octave, there would be (12 * 11 * 10) / (3 * 2 * 1) = 220 possibilies. That seemed a bit to much to put in a readable diagram. So I restricted this pool to combinations where the smallest interval is a minor third. This results in fourty triads: 12 major, 12 minor, 12 diminished and 4 augmented chords.

Major:
![Major chords](readme_assets/2_major.svg)

Minor:
![Minor chords](readme_assets/2_minor.svg)

Diminished:
![Diminished chords](readme_assets/2_diminished.svg)

Augmented:
![Augmented chords](readme_assets/2_augmented.svg)

There are many ways how to get from one of these chords to another by only changing one note. The image below shows examples of each type of modification for one key. All in all there are 114 links between the 40 chords.

![Links between the chords](readme_assets/3_links.svg)

### Force direction and 4D space

When I started this project I hoped to draw this network of chords and links on paper. Soon I discovered, that with any possible layout it would be just to many links overlapping the whole thing. So I programmed a so called "force directed layout", where all the chords are connected with springs that try to find the most relaxed layout for the whole network. 

It is possible to create this kind of layout in 2D space, 3D space and even higher dimensions. I first tried 3D space which worked. I didn't like though, that the network didn't get to a symmetrical state when being relaxed. So I moved to 4D space, which seems to be more adequate for this kind of network. The network always finds the same symmetrical relaxation state.

## The application

When you launch the application (by clicking on the image below or on "Launch App" in this sites header) you see the harmony diagram in the main area. Each sphere represents on of the chords. Diminished chords are yellow, minor chords light green, major chords dark green and augmented chords blue.

### Interaction:
- Click and drag spheres
- Clicking on a sphere plays the sound
- Zooming: Use scroll wheel or click and drag up and down on the main area
- Rotating: Use one of the "trackpads". The first one rotates the network in 3D space, the other two are rotating in 4D space. Rotation in 4D space is hard to imagine, so best would be to just play around with this.

[![Launch app](readme_assets/4_app-screen.png)](./app/)

## Acknowledgements

Music encraving done with LilyPond 2.18.2 — [www.lilypond.org](www.lilypond.org)
Programming of the app uses [p5.js](http://p5js.org)
Marimba sounds from [PatchArena](http://patcharena.com/free-marimba-samples-patcharena-marimba-in-sfz-format/)
