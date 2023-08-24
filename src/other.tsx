import { defineComponent, onMounted, ref } from 'vue';
import { isMatching, match, P, Pattern } from 'ts-pattern';
export default defineComponent({
  setup() {
    const types = () => {
      const input: unknown = 2;

      const output = match(input)
        .with(2, () => 'number: two')
        .with(true, () => 'boolean: true')
        .with('hello', () => 'string: hello')
        .with(undefined, () => 'undefined')
        .with(null, () => 'null')
        .with(NaN, () => 'number: NaN')
        .with(20n, () => 'bigint: 20n')
        .otherwise(() => 'something else');

      console.log(output);
    };

    const getUser = () => {
      const userPattern = {
        name: P.string,
        postCount: P.number,
        posts: P.array({ title: P.string }),
        age: P.optional(P.number),
      };

      type User = P.infer<typeof userPattern>;
      const input = '123';
      const isUserList = isMatching(userPattern);

      return isUserList(input) ? (input as User) : null;
    };

    const notMatch = () => {
      const input: string | number = 1;
      return match(input)
        .with(P.not(P.string), (value) => `value is NOT a string: ${value}`)
        .with(P.string, (value) => `value is a string: ${value}`)
        .exhaustive();
    };

    onMounted(() => {
      types();
      notMatch();
      getUser();
    });

    return null;
  },
});
