/*
#[test_only]
module example1::example1_tests;
// uncomment this line to import the module
// use example1::example1;

const ENotImplemented: u64 = 0;

#[test]
fun test_example1() {
    // pass
}

#[test, expected_failure(abort_code = ::example1::example1_tests::ENotImplemented)]
fun test_example1_fail() {
    abort ENotImplemented
}
*/


module example1::example1_tests{
    use example1::example1;

    #[test]
    fun test_counter(){
        let sum = example1::counter(10);
        debug::print(&sum);

    }

}