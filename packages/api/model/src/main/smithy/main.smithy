$version: "2"
namespace com.my.company

use aws.auth#sigv4
use aws.protocols#restJson1

/// A sample smithy api
@restJson1
@sigv4(name: "execute-api")
service MyApi {
    version: "1.0"
    operations: [SayHello]
}

@readonly
@http(method: "GET", uri: "/hello")
operation SayHello {
    input: SayHelloInput
    output: SayHelloOutput
    errors: [ApiError]
}

string Name
string Message

@input
structure SayHelloInput {
    @httpQuery("name")
    @required
    name: Name
}

@output
structure SayHelloOutput {
    @required
    message: Message
}

@error("client")
@httpError(400)
structure ApiError {
    @required
    errorMessage: Message
}
