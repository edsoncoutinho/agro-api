import { Either, left, right } from "./either";

function doSomething(shouldSuccess: boolean): Either<string, string> {
  if (shouldSuccess) {
    return right("success");
  }
  return left("error");
}

it("success result", () => {
  const result = doSomething(true);

  expect(result.isRight()).toEqual(true);
  expect(result.isLeft()).toEqual(false);
});

it("error result", () => {
  const result = doSomething(false);

  expect(result.isRight()).toEqual(false);
  expect(result.isLeft()).toEqual(true);
});
