def run(data):
    """
    Run a Thunder source extraction algorithm
    """
    from thunder import SourceExtraction
    method = SourceExtraction('nmf')
    result = method.fit(data)
    return result