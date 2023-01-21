/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request))
  })

  const createAirtableRecord = body => {
	return fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`, {
	  method: 'POST',
	  body: JSON.stringify(body),
	  headers: {
		Authorization: `Bearer ${AIRTABLE_API_KEY}`,
		'Content-type': `application/json`
	  }
	})
  }

  const FORM_URL = "https://course-tracker-70h.pages.dev/"

  async function handleRequest(request) {
	const url = new URL(request.url)
  
	if (url.pathname === "/submit") {
	  return submitHandler(request)
	}
  
	return Response.redirect(FORM_URL)
  }
  
  
  const submitHandler = async request => {
	if (request.method !== "POST") {
	  return new Response("Method Not Allowed", {
		status: 405
	  })
	}
  
	const body = await request.formData();
  
	const {
	  name,
	  link,
	  tag,
	} = Object.fromEntries(body)

	const reqBody = {
		fields: {
		  "Course Name": name,
		  "Course Link": link,
		  "Tag": tag,
		}
	  }
	
	  await createAirtableRecord(reqBody)
	  return Response.redirect(FORM_URL)
	}
