const base = bodyContent => `
	<html>
		<head>
			<title>Success</title>
			<style>html,body { font-family: sans-serif; }</style>
		</head>
		<body>
			${bodyContent}
		</body>
	</html>
`;

const generate = (title, description, messageContents, delay) => base(`
		<h1>${title}</h1>
		<p>${description}</p>
		<script>
		(function() {
			if (window.opener) {
				window.opener.postMessage(${JSON.stringify(messageContents)}, '*');
			}
			setTimeout(function () {
				window.close();
			}, ${delay})
		})()
		</script>
	`);

module.exports = {
  success: (payload) => generate(
    'Successfully linked.',
    'This window will automatically close.', payload, 200),
  fulfilled: generate(
    'Attempt Unsuccessful', 'This token has already been used, please ensure a fresh session is used.',
    { errorCode: 'fulfilled' }, 500),
  error: generate(
    'Unknown Error', 'Unfortunately an error occured and we were unable to authenticate with the provider. An incident has been created.',
    { errorCode: 'unknown' }, 500)

};
