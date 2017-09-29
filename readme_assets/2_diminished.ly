

line_one = \relative c' {
  <c es ges>4     <cis e g>  <d f as> 
  <dis fis a>   <e ges bes>   <f as ces> 
  <fis a c>   <g bes des>    <gis b d> 
  <a c es>     <ais cis e>  <b d f> 
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