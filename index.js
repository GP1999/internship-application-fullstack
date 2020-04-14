addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
//cnt is count of request which will decide the type of varient to send 
let cnt=0;
let mod=1000000000;
//This class is use to replace the content of HTML using HTMLReeritter
class ReplaceContent{
  constructor(tag){
    this.tag=tag;
  }
  element(element){
    if(this.tag==='title'){
      element.setInnerContent("My Project");
    }else if(this.tag==='h1#title'){
      element.setInnerContent('Hey There!');
    }else if(this.tag==='p#description')
    {
      element.setInnerContent("This is the project i am working on");
    }else if(this.tag==='a#url'){
      const attribute=element.getAttribute('href');
     // const attributeName='a';
      element.setInnerContent("Rediret to TopNews");
      if(attribute){
        element.setAttribute(
          'href',
          'http://gauravponkiya.pythonanywhere.com/'
        );
      }
      
    }
  }
}
//declared the reWrite to use it for transformation of HTML Code
const reWrite= new HTMLRewriter()
              .on('title',new ReplaceContent('title'))
              .on('h1#title',new ReplaceContent('h1#title'))
              .on('p#description',new ReplaceContent('p#description'))
              .on('a#url',new ReplaceContent('a#url'));

async function handleRequest(request) {
  
  let url="https://cfw-takehome.developers.workers.dev/api/variants";
  let data;
  //Increase count every time whene request encounter
  cnt=cnt+1;
  cnt%=mod;
  //Get the resource from given url ,which is two urls of varient
  const fetchResult=fetch(url); 
  const response=await fetchResult;
  if(response.ok)
  { 
    const jsonData=await response.json();
  //if count is even then we can respond with variant 1 else variant 2 by this we can distribute 
  //request in to 50% to each
  if(cnt%2==0){
    //fetch variant-1 using url-1 of jsonData
    const fetchVariant=fetch(jsonData.variants[0]);
    const responseVariant=await fetchVariant;
    //Assign response object to data
    data=responseVariant;
  


  }else{
    //fetch variant-2 using url-2 of jsonData
    const fetchVariant=fetch(jsonData.variants[1]);
    const responseVariant=await fetchVariant;
     data=responseVariant;
    

  }
}
//transforme the original HTML with custome HTML by using reWrite
const page=reWrite.transform(data);
  return new Response(await page.text(), {
    headers: { 'content-type': 'text/html' ,'Set-Cookie':[`variant=${cnt%2}`,'path=/']},'credentials':'same-origit',
  });
}
