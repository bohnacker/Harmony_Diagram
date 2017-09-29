Harmony Diagram is a [p5.js](http://p5js.org) project that displays the relations of all 40 possible triads.

# Explanation

One of the main elements of music are harmonies. They appear when two ore more notes are played together. In western music, the basic harmonies are triads. That is when exactly three notes come together. Below you see two examples: a c major and a c minor chord.

![C major and c minor](readme_assets/1.svg)

These two chords are quite closely related bacause you have to change only one note to get from one to the other. I wanted to know how a network structure would look like, if one would connect all possible triads in that way. 

The first question was: how many triads are there? If you allow all possible combinations of the 12 tones in an octave, there would be (12 * 11 * 10) / (3 * 2 * 1) = 220 possibilies. That seemed a bit to much to put in a readable diagram. So I restricted this pool to combinations where the smallest interval is a minor third. This results in fourty triads: 12 major, 12 minor, 12 diminished and 4 augmented chords.

Major:
![Major chords](readme_assets/2_major.svg)

Minor:
![Minor chords](readme_assets/2_minor.svg)

Diminished:
![Diminished chords](readme_assets/2_diminished.svg)

Augmented:
![Augmented chords](readme_assets/2_augmented.svg)
