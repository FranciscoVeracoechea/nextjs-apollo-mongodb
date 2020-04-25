import React from 'react';
import Head from 'next/head'

const Meta: React.FC<{
  readonly title: string,
  readonly desc: string,
  readonly creator: string,
  readonly canonical: string,
  readonly image?: string,
}> = (props) => (      
  <Head>
    <title>{props.title}</title>
    <meta name="description" content={props.desc} />
    <meta property="og:type" content="website" />
    <meta name="og:title" property="og:title" content={props.title} />
    <meta name="og:description" property="og:description" content={props.desc} />
    <meta property="og:site_name" content="Proper Noun" />
    <meta property="og:url" content={`${props.canonical}`} />  
    <link rel="icon" type="image/png" href="/static/images/favicon.ico" />
    <link rel="apple-touch-icon" href="/static/images/favicon.ico" />
    {
      props.image ? (
        <meta property="og:image" content={`${props.image}`} />  
      ) : (
        <meta
          property="og:image"
          content="https://www.propernoun.co/static/images/proper-noun-social.png"
        />  
      )   
    } 
    {
      props.image &&   
      <meta name="twitter:image" content={`${props.image}`} />   
    }
    {
      props.canonical &&
      <link rel="canonical" href={`${props.canonical}`} />
    }
  </Head>
)
export default Meta