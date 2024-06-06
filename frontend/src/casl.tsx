import { createContext } from "react";
import { PureAbility, FieldMatcher } from "@casl/ability";
import { createContextualCan } from "@casl/react";
import { gql } from "@apollo/client";
import { apolloClient } from "./apollo-client";

// prettier-ignore
const fieldMatcher: FieldMatcher = (fields) => (field) => fields.includes(field);
export const ability = new PureAbility([], {
  fieldMatcher: fieldMatcher,
});

export const AbilityContext = createContext(ability);
export const Can = createContextualCan(AbilityContext.Consumer);

type UpdateAbilityOptions = {
    skipQuery?: boolean,
}

export async function updateAbility(options: UpdateAbilityOptions = {}) {
    const { skipQuery } = options;
    if(skipQuery) {
      ability.update([]);
      return;
    }

  const res = await apolloClient.query({
    query: gql`
      query GetRawRules {
        rawRules {
          action
          subject
          fields
          conditions
        }
      }
    `,
    fetchPolicy: "no-cache",
  });
  const { rawRules } = res.data;
  ability.update(rawRules || []);
}
