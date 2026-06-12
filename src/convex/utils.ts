export type APIResponse =
	| {
			success: true;
			data: unknown;
	  }
	| {
			success: false;
			error: string;
	  };

export const createAPIResponse = (obj: APIResponse, status: number) => {
	return new Response(JSON.stringify(obj), {
		status,
		headers: { 'Content-Type': 'application/json' }
	});
};

export type GetBearerTokenResponse =
	| {
			success: true;
			data: string;
	  }
	| {
			success: false;
			error: string;
	  };

export const getBearerToken = (request: Request): GetBearerTokenResponse => {
	const authHeader = request.headers.get('Authorization');

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return {
			success: false,
			error: 'Missing or invalid Authorization header'
		};
	}

	const token = authHeader.slice(7); // Remove "Bearer " prefix

	return {
		success: true,
		data: token
	};
};

export type APIHelperResponse =
	| {
			success: true;
	  }
	| {
			success: false;
			error: string;
			status: number;
	  };

export const validateBearerToken = (request: Request, expectedToken: string): APIHelperResponse => {
	return validateBearerTokenMultiple(request, [expectedToken]);
};

export const validateBearerTokenMultiple = (
	request: Request,
	anyExpectedTokens: string[]
): APIHelperResponse => {
	if (!anyExpectedTokens || anyExpectedTokens.length === 0) {
		return {
			success: false,
			error: 'Internal Server Error',
			status: 500
		};
	}

	const tokenResponse = getBearerToken(request);

	if (!tokenResponse.success) {
		return {
			success: false,
			error: tokenResponse.error,
			status: 400
		};
	}

	const token = tokenResponse.data;

	if (anyExpectedTokens.some((expectedToken) => expectedToken && token === expectedToken)) {
		return {
			success: true
		};
	}

	return {
		success: false,
		error: 'Unauthorized',
		status: 401
	};
};
