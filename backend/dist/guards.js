import { GraphQLError } from "graphql";
export async function guardByRoles(roles, contextValue) {
    const { role } = contextValue.user;
    if (!roles.includes(role)) {
        throw new GraphQLError("User is not authorized", {
            extensions: {
                http: { status: 403 },
            },
        });
    }
}
