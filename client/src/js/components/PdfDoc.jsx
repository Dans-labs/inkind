import React, {Component, PropTypes} from 'react'

const PdfDoc1 = (props) => {
  const docName = props.docName;
  const href = `/static/docs/${docName}.pdf`;
  return (
    <p style={{paddingLeft: '0.5em'}}>
      <a target="_blank" href={href}>{docName}</a> (open pdf in a new tab)
    </p>
  )
}

const PdfDoc = (props) => {
  const docName = props.docName;
  const href = `/static/docs/${docName}.pdf`;
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  return iOS ? (
      <p>
        <a target="_blank" href={href}>{docName}</a> (open pdf in a new tab)
      </p>
    ) : (
      <object
        height="100%" width="100%"
        data={href} type="application/pdf"
      >
        alt : <a target="_blank" href={href}>{docName}</a> (open pdf in a new tab)
      </object>
  )
}
export default PdfDoc
