import { parse, validate } from 'convex-helpers/validators';
import type { Infer, Validator } from 'convex/values';

export type ParseResult<V extends Validator<any, any, any>> =
	| { ok: true; value: Infer<V> }
	| { ok: false; error: string };

/** Validate only; returns boolean. */
export function isValid<V extends Validator<any, any, any>>(
	validator: V,
	data: unknown
): data is Infer<V> {
	return validate(validator, data);
}

/** Validate and return typed value, or a safe error string for HTTP. */
export function tryParse<V extends Validator<any, any, any>>(
	validator: V,
	data: unknown
): ParseResult<V> {
	if (!validate(validator, data)) {
		return { ok: false, error: 'Invalid request body' };
	}
	try {
		return { ok: true, value: parse(validator, data) };
	} catch (e) {
		return {
			ok: false,
			error: e instanceof Error ? e.message : 'Invalid request body'
		};
	}
}

/** Validate and return typed value; throws on failure (for internal use). */
export function parseBody<V extends Validator<any, any, any>>(
	validator: V,
	data: unknown
): Infer<V> {
	return parse(validator, data); // throws ValidationError-style message
}
