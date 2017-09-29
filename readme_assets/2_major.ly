

line_one = \relative c' {
  <c e g>4 <des f as> <d fis a> <es g bes> 
  <e gis b> <f a c> <fis ais cis> <g b d> 
  <as c es> <a cis e> <bes d f> <b dis fis> 
}


\score {
  <<  
  \new Staff {
    \new Voice = "one" \time 1/4 \line_one
  }
  >>
  \layout {
    \context {
      \Staff
      \remove "Time_signature_engraver"
    }
    \context {
      \Voice
    }
    \context {
      \Score
      \override SpacingSpanner.base-shortest-duration = #(ly:make-moment 1/32)
    }
  }
}