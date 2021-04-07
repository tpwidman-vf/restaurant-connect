resource "aws_lex_bot" "order_food_bot" {
    child_directed                  = false
    create_version                  = false
    detect_sentiment                = false
    enable_model_improvements       = true
    idle_session_ttl_in_seconds     = 300
    locale                          = "en-US"
    name                            = "OrderIntake"
    nlu_intent_confidence_threshold = 0
    process_behavior                = "SAVE"
    voice_id                        = "Salli"

    abort_statement {
        message {
            content      = "Sorry, I could not understand. Goodbye."
            content_type = "PlainText"
        }
    }

    clarification_prompt {
        max_attempts = 5

        message {
            content      = "Sorry, can you please repeat that?"
            content_type = "PlainText"
        }
    }

    intent {
        intent_name    = "CheckOrderStatus"
        intent_version = "3"
    }
    intent {
        intent_name    = "GetFoodOrder"
        intent_version = "6"
    }

}