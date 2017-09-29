

line_one = \relative c' {
  <c es g>4     <cis e gis>  <d f a> 
  <es ges bes>  <e g b>      <f as c> 
  <fis a cis>   <g bes d>    <gis b dis> 
  <a c e>       <bes des f>  <b d fis> 
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